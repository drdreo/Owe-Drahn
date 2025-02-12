import {
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
    ConnectedSocket
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { LoggerService } from '../../utils/logger/logger.service';
import { Logger } from '../../utils/logger/logger.decorator';
import { GameErrorCode } from '../GameError';
import { SocketService } from './socket.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { OnModuleDestroy } from '@nestjs/common';

interface Handshake {
    playerId: string;
    room: string;
    uid: string;
}

export interface SocketMessage {
    room: string;
    eventName: string;
    data: unknown;
}

@WebSocketGateway()
export class SocketGateway
    implements OnModuleDestroy, OnGatewayConnection, OnGatewayDisconnect
{
    @WebSocketServer()
    server: Server;

    clients: Map<string, any> = new Map();

    private unsubscribe$ = new Subject<void>();

    constructor(
        @Logger('SocketGateway') private logger: LoggerService,
        private readonly socketService: SocketService
    ) {
        this.socketService.messages$
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((message: SocketMessage) => {
                this.emitToRoom(message.room, message.eventName, message.data);
            });
    }

    onModuleDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    handleConnection(socket: Socket) {
        this.logger.log(`Socket[${socket.id}] connected`);
    }

    handleDisconnect(socket: Socket) {
        const client = this.getClient(socket);
        this.logger.log(`Disconnected socket[${socket.id}]`);

        if (client) {
            const { room, playerId } = client;
            this.removeClient(socket.id);

            if (playerId) {
                this.socketService.disconnected(room, playerId);
            }
        }
    }

    private getClient(socket) {
        return this.clients.get(socket.id);
    }

    private removeClient(socketId: string): boolean {
        return this.clients.delete(socketId);
    }

    // send too all clients in room
    private emitToRoom(room: string, eventName: string, data?: unknown) {
        this.logger.debug(`emitting to room[${room}] ${eventName}`);

        this.server.in(room).emit(eventName, data);
    }

    @SubscribeMessage('handshake')
    private playerHandshake(
        @ConnectedSocket() socket: Socket,
        @MessageBody() handshakeData: Handshake
    ): void {
        const { room, playerId, uid } = handshakeData;

        this.clients.set(socket.id, handshakeData);
        this.logger.log(
            `New connection handshake from socket[${socket.id}] player[${playerId}] in room[${room}].${uid ? `LoggedIn[${uid}]` : ''}`
        );

        const gameUpdate = this.socketService.playerHandshake(
            room,
            playerId,
            uid
        );
        if (gameUpdate) {
            socket.join(room);

            // someone joined, update others
            this.emitToRoom(room, 'gameUpdate', gameUpdate);
        } else {
            socket.emit('gameError', {
                code: GameErrorCode.NO_GAME,
                message: `Trying to join game[${room}], but does not exist!`
            });
        }
    }

    @SubscribeMessage('leave')
    private leave(@ConnectedSocket() socket: Socket): void {
        const { room, playerId } = this.getClient(socket);
        const left = this.socketService.leave(room, playerId);
        if (left) {
            socket.leave(room);
        }
    }

    @SubscribeMessage('ready')
    private ready(
        @ConnectedSocket() socket: Socket,
        @MessageBody() ready: boolean
    ): void {
        const { room, playerId } = this.getClient(socket);
        this.socketService.ready(room, playerId, ready);
    }

    @SubscribeMessage('rollDice')
    private rollDice(@ConnectedSocket() socket: Socket): void {
        const { room, playerId } = this.getClient(socket);
        this.socketService.rollDice(room, playerId);
    }

    @SubscribeMessage('loseLife')
    private loseLife(@ConnectedSocket() socket: Socket): void {
        const { room, playerId } = this.getClient(socket);
        this.socketService.loseLife(room, playerId);
    }

    @SubscribeMessage('chooseNextPlayer')
    private chooseNextPlayer(
        @ConnectedSocket() socket: Socket,
        @MessageBody() nextPlayerId: string
    ): void {
        const { room, playerId } = this.getClient(socket);
        this.socketService.chooseNextPlayer(room, playerId, nextPlayerId);
    }

    removeListener(socket) {
        const gameEvents = [
            'loseLife',
            'rollDice',
            'leave',
            'disconnect',
            'ready',
            'chooseNextPlayer'
        ];
        for (let event of gameEvents) {
            socket.removeAllListeners(event);
        }
    }
}
