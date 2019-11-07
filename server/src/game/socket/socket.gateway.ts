import {
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect,
    ConnectedSocket
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameService } from '../game.service';
import { LoggerService } from 'src/utils/logger/logger.service';
import { Logger } from 'src/utils/logger/logger.decorator';
import { GameErrorCode } from '../GameError';
import { SocketService } from './socket.service';


interface Handshake {
    playerId: string;
    room: string;
    uid: string;
}

@WebSocketGateway()
export class SocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    clients: Map<string, any> = new Map();

    constructor(@Logger('SocketGateway') private logger: LoggerService, private readonly socketService: SocketService, private readonly gameService: GameService) { }

    afterInit() {
        this.logger.log('initialized');
        this.socketService.emitToRoom = this.emitToRoom;
    }

    handleDisconnect(socket: Socket) {
        const { room, playerId } = this.clients.get(socket.id);
        this.logger.log(`Disconnected socket[${playerId}]`);

        this.removeClient(socket.id);

        this.socketService.disconnected(room, playerId)
    }

    private removeClient(socketId: string) {
        this.clients.delete(socketId);
    }

    handleConnection(socket: Socket) {
        this.logger.log(`Socket[${socket.id}] connected`);
    }

    // send too all clients in room
    private emitToRoom(room: string, eventName: string, data?: unknown) {
        console.log("emitToRoom", eventName);

        this.server.in(room).emit(eventName, data);
    }

    @SubscribeMessage('handshake')
    private playerHandshake(@ConnectedSocket() socket: Socket, @MessageBody() handshakeData: Handshake): void {
        this.clients.set(socket.id, handshakeData)

        console.log(`New connection handshake from socket[${socket.id}] player[${handshakeData.playerId}] in room[${handshakeData.room}]`);
        const { room, playerId, uid } = handshakeData;

        this.removeListener(socket);

        if (this.gameService.hasGame(room)) {

            if (this.gameService.isPlayerOfGame(room, playerId)) {
                socket.join(room);

                this.gameService.connect(room, playerId, uid);

                // someone joined, update others
                const update = this.gameService.getGameUpdate(room);
                this.emitToRoom(room, 'gameUpdate', update);

                socket.on('leave', () => {
                    console.log(`socket[${socket.id}] - leave`);
                    const left = this.gameService.leave(room, playerId);
                    if (left) {
                        socket.leave(room);
                    }
                });

                socket.on('ready', (ready: boolean) => {
                    console.log(`socket[${socket.id}] - ready`);

                    this.gameService.ready(room, playerId, ready);
                });

                socket.on('rollDice', () => {
                    console.log(`socket[${socket.id}] - rollDice`);

                    this.gameService.rollDice(room, playerId);
                });

                socket.on('loseLife', () => {
                    console.log(`socket[${socket.id}] - loseLife`);

                    this.gameService.loseLife(room, playerId);
                });

                socket.on('chooseNextPlayer', (nextPlayerId: string) => {
                    console.log(`socket[${socket.id}] - chooseNextPlayer`);

                    this.gameService.chooseNextPlayer(room, playerId, nextPlayerId);
                });
            } else {
                // Spectator Feature
                socket.join(room);
                // tell the spectator initial data
                const update = this.gameService.getGameUpdate(room);
                socket.emit('gameUpdate', update);
            }
        } else {
            socket.emit('gameError', {
                code: GameErrorCode.NO_GAME,
                message: `Trying to join game[${room}], but does not exist!`,
            });
        }
    }

    removeListener(socket) {
        const gameEvents = ['loseLife', 'rollDice', 'leave', 'disconnect', 'ready', 'chooseNextPlayer'];
        for (let event of gameEvents) {
            socket.removeAllListeners(event);
        }
    }
}