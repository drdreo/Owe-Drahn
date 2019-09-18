import { Service } from 'typedi';
import * as socketIo from 'socket.io';
import { GameService } from './game/game.service';
import * as http from 'http';
import { Command } from './game/Command';

@Service()
export class SocketService {

    private io: socketIo.Server;

    get Instance(): socketIo.Server {
        return this.io;
    }

    constructor(private readonly gameService: GameService) {

    }

    // send too all clients in room
    private emitToRoom(room: string, eventName: string, data?: unknown) {

        try {
            this.Instance.in(room).emit(eventName, data);
        } catch (e) {
            // TODO: handle error, when we try to emit something to a player, that has left. --> no socket connection
        }
    }

    private clientConnected(socket: socketIo.Socket): void {

        socket.on('handshake', (handshakeData) => {
            const {room, playerId} = handshakeData;

            socket.join(room);

            // someone joined, update others
            const result = {error: undefined, data: undefined};
            result.data = this.gameService.getGameUpdate(room);
            this.io.to(room).emit('gameUpdate', result);

            socket.on('ready', () => {
                const result = {error: undefined, data: undefined};

                this.gameService.ready(room, playerId);

                // check if everyone is ready
                if (this.gameService.isEveryoneReady(room)) {
                    this.gameService.nextPlayer(room);
                    const game = this.gameService.getGame(room);
                    game.started = true;
                    // reset everyones ready state for UI reasons
                    game.players.map(player => player.ready = false);
                }

                result.data = this.gameService.getGameUpdate(room);

                this.io.to(room).emit('gameUpdate', result);
            });

            socket.on('rollDice', () => {
                try {
                    let rolledDice = this.gameService.rollDice(room, playerId);
                    if (rolledDice) {
                        this.io.to(room).emit('rolledDice', {data: rolledDice});
                    } else {
                        this.io.to(room).emit('lost', {playerId});
                    }

                    // send the reset delayed
                    this.gameService.nextPlayer(room).then(() => {
                        const data = this.gameService.getGameUpdate(room);
                        this.io.to(room).emit('gameUpdate', {data});
                    });

                    const data = this.gameService.getGameUpdate(room);
                    this.io.to(room).emit('gameUpdate', {data});

                } catch (err) {
                    this.io.to(room).emit('gameError', err.message);
                }
            });

            socket.on('loseLife', () => {
                try {
                    this.gameService.loseLife(room, playerId);
                    this.gameService.nextPlayer(room);

                    const data = this.gameService.getGameUpdate(room);
                    this.io.to(room).emit('gameUpdate', {data});
                } catch (err) {
                    this.io.to(room).emit('gameError', err.message);
                }
            });
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
