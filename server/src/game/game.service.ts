import {Injectable, Logger} from '@nestjs/common';
import { Game } from './Game';
import { Observable } from 'rxjs';
import { Command } from './Command';
import { DBService } from '../db/db.service';
import { tap } from 'rxjs/operators';

interface Room {
    room: string;
    started: boolean;
}

export interface GamesOverview {
    rooms: Room[];
    totalPlayers: number;
}

@Injectable()
export class GameService {
    private games = new Map<string, Game>();
    private logger = new Logger(GameService.name);

    constructor(private readonly dbService: DBService) {
        this.logger.log('constructed!');
    }

    /**
     * Helpers
     */
    createGame(room: string): void {
        this.games.set(room, new Game());
    }

    getGame(room: string): Game {
        return this.games.get(room);
    }

    getGamesOverview(): GamesOverview {
        let totalPlayers = 0;
        const rooms = [];

        this.games.forEach((game, room) => {
            rooms.push({ room, started: game.started });
            totalPlayers += game.getPlayers().length;
        });
        return { totalPlayers, rooms };
    }

    hasGame(room: string): boolean {
        return this.games.has(room);
    }

    hasGameStarted(room: string): boolean {
        return this.games.get(room).started;
    }

    removeIfPlayer(playerId: string): boolean {
        let playersRoom = false;
        for (const [room, game] of this.games) {
            if (game.isPlayer(playerId)) {
                playersRoom = !!room;
                this.leave(room, playerId);
                break;
            }
        }
        return playersRoom;
    }

    isPlayerOfGame(room: string, playerId: string): boolean {
        return playerId && this.games.get(room).isPlayer(playerId);
    }

    isConnected(room: string, playerId: string): boolean {
        const game = this.getGame(room);
        return (
            game && game.isPlayer(playerId) && game.isPlayerConnected(playerId)
        );
    }

    getGameUpdate(room: string) {
        const game = this.getGame(room);
        if (game) {
            return game.getGameUpdate();
        }

        return undefined;
    }

    getGameCommand(room: string): Observable<Command> {
        const game = this.getGame(room);
        return game.command$.pipe(
            tap((cmd) => {
                if (cmd.eventName === 'gameOver') {
                    this.dbService.storeGame(game);
                }
            })
        );
    }

    /**
     * Game Methods
     */

    /**
     * If the Player was a registered Player, we query necessary data from DB and set it on the player.
     *
     * @param room - The room key
     * @param playerId - The players Id for this game
     * @param [uid] - The clients UID
     */
    async connect(room: string, playerId: string, uid?: string) {
        this.logger.debug(`room[${room}][${playerId}] connect`);

        let stats = undefined;
        if (uid) {
            stats = await this.dbService.getPlayersStatistics(uid);
        }
        this.getGame(room).setStatsOnPlayer(playerId, uid, stats);
    }

    disconnect(room: string, playerId: string): void {
        this.logger.debug(`room[${room}][${playerId}] disconnect`);

        const game = this.getGame(room);
        if (game) {
            this.getGame(room).disconnect(playerId);
        }
    }

    joinGame(room: string, playerId: string, username: string): void {
        this.getGame(room).join(playerId, username);
    }

    leave(room: string, playerId: string): boolean {
        this.logger.debug(`room[${room}][${playerId}] leaving`);

        const game = this.getGame(room);
        if (game) {
            game.leave(playerId);
            // clean up game
            if (!game.hasPlayers()) {
                this.logger.debug(`Removing game[${room}]`);
                this.games.delete(room);
            }
            return true;
        }
        return false;
    }

    ready(room: string, playerId: string, ready: boolean): void {
        this.logger.debug(`room[${room}] ready up`);
        this.getGame(room).ready(playerId, ready);
    }

    rollDice(room: string, playerId: string) {
        this.logger.debug(`room[${room}] rolling dice`);
        return this.getGame(room).rollDice(playerId);
    }

    loseLife(room: string, playerId: string) {
        this.logger.debug(`room[${room}] losing life`);
        return this.getGame(room).loseLife(playerId);
    }

    chooseNextPlayer(room: string, playerId: string, nextPlayerId: string) {
        this.logger.debug(`room[${room}]: choosing next player`);
        return this.getGame(room).chooseNextPlayer(playerId, nextPlayerId);
    }
}
