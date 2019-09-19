import * as socketIo from 'socket.io';
import * as http from 'http';

import { Service } from 'typedi';
import { GameService } from './game/game.service';
import { Command } from './game/Command';
import { GameErrorCode } from './game/GameError';

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

    private clientConnected(socket: socketIo.Socket): void {

        socket.on('handshake', (handshakeData) => {
            const {room, playerId} = handshakeData;

            if (this.gameService.hasGame(room)) {

                if (this.gameService.isPlayerOfGame(room, playerId)) {
                    socket.join(room);

                    this.gameService.connect(room, playerId);

                    // someone joined, update others
                    const update = this.gameService.getGameUpdate(room);
                    this.emitToRoom(room, 'gameUpdate', update);

                    socket.on('disconnect', () => {
                        this.gameService.disconnect(room, playerId);
                        // remove player if he doesn't reconnect
                        setTimeout(() => {
                            if (!this.gameService.isConnected(room, playerId)) {
                                this.gameService.leave(room, playerId);
                            }
                        }, 5000);
                    });

                    socket.on('ready', (ready: boolean) => {
                        this.gameService.ready(room, playerId, ready);
                    });

                    socket.on('rollDice', () => {
                        this.gameService.rollDice(room, playerId);
                    });

                    socket.on('loseLife', () => {
                        this.gameService.loseLife(room, playerId);
                    });

                    socket.on('chooseNextPlayer', (nextPlayerId: string) => {
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

    connect(server: http.Server): void {
        this.io = socketIo(server);
        this.io.sockets.on('connection', (client: socketIo.Socket) => {
            this.clientConnected(client);
        });
    }

    subscribeToGame(room: string): void {
        this.gameService.getGameCommand(room)
            .subscribe((command: Command) => {
                this.emitToRoom(room, command.eventName, command.data);
            });

    }
}
