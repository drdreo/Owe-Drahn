import * as socketIo from 'socket.io';
import * as http from 'http';

import { Service } from 'typedi';
import { GameService } from './game/game.service';
import { Command } from './game/Command';
import { GameErrorCode } from './game/GameError';
import { takeUntil } from 'rxjs/operators';

@Service()
export class SocketService {

    private io: socketIo.Server;

    get Instance(): socketIo.Server {
        return this.io;
    }

    constructor(private readonly gameService: GameService) { }

    // send too all clients in room
    private emitToRoom(room: string, eventName: string, data?: unknown) {
        this.Instance.in(room).emit(eventName, data);
    }

    connect(server: http.Server): void {
        this.io = socketIo(server);
        this.io.sockets.on('connection', (socket: socketIo.Socket) => {
            this.socketConnected(socket);
        });
    }

    private socketConnected(socket: socketIo.Socket): void {

        socket.on('handshake', (handshakeData) => {
            console.log(`New connection handshake from socket[${socket.id}] player[${handshakeData.playerId}] in room[${handshakeData.room}]`);
            const {room, playerId, uid} = handshakeData;

            this.removeListener(socket);
            if (this.gameService.hasGame(room)) {

                if (this.gameService.isPlayerOfGame(room, playerId)) {
                    socket.join(room);

                    this.gameService.connect(room, playerId, uid);

                    // someone joined, update others
                    const update = this.gameService.getGameUpdate(room);
                    this.emitToRoom(room, 'gameUpdate', update);

                    socket.once('disconnect', () => {
                        console.log(`Disconnected socket[${socket.id}]`);

                        this.gameService.disconnect(room, playerId);
                        // remove player if he doesn't reconnect
                        setTimeout(() => {
                            if (!this.gameService.isConnected(room, playerId)) {
                                this.gameService.leave(room, playerId);
                            }
                        }, 10000);
                    });

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
        });
    }



    subscribeToGame(room: string): void {
        this.gameService.getGameCommand(room)
            .subscribe((command: Command) => {
                this.emitToRoom(room, command.eventName, command.data);
            });

    }

    removeListener(socket) {
        const gameEvents = ['loseLife', 'rollDice', 'leave', 'disconnect', 'ready', 'chooseNextPlayer'];
        for (let event of gameEvents) {
            socket.removeAllListeners(event);
        }
    }
}
