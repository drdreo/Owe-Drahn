import { Service } from 'typedi';
import { Game } from './Game';
import { Observable } from 'rxjs';
import { Command } from './Command';

interface Room {
    room: string;
    started: boolean;
}

export interface GamesOverview {
    rooms: Room[];
    totalPlayers: number;
}

@Service()
export class GameService {

    private games = new Map<string, Game>();

    createGame(room: string): void {
        this.games.set(room, new Game());
    }

    getGame(room: string): Game {
        return this.games.get(room);
    }

    getGamesOverview(): GamesOverview {

        let totalPlayers = 0;
        let rooms = [];

        this.games.forEach((game, room) => {
            rooms.push({room, started: game.started});
            totalPlayers += game.getPlayers().length;
        });
        return {totalPlayers, rooms};
    }

    hasGame(room: string): boolean {
        return this.games.has(room);
    }

    hasGameStarted(room: string): boolean {
        return this.games.get(room).started;
    }

    isPlayerOfGame(room: string, playerId: string): boolean {
        return playerId && this.games.get(room).isPlayer(playerId);
    }

    joinGame(room: string, playerId: string, username: string): void {
        this.getGame(room).joinGame(playerId, username);
    }

    getGameUpdate(room: string) {
        const game = this.getGame(room);
        if (game) {
            return game.getGameUpdate();
        }

        return undefined;
    }

    getGameCommand(room: string): Observable<Command> {
        return this.getGame(room).command$;
    }

    connect(room: string, playerId: string): void {
        this.getGame(room).connect(playerId);
    }

    isConnected(room: string, playerId: string): boolean {
        const game = this.getGame(room);
        return game && game.isPlayer(playerId) && game.isPlayerConnected(playerId);
    }

    disconnect(room: string, playerId: string): void {
        const game = this.getGame(room);
        if (game) {
            this.getGame(room).disconnect(playerId);
        }
    }

    leave(room: string, playerId: string): void {
        const game = this.getGame(room);
        game.leave(playerId);
        // clean up game
        if (!game.hasPlayers()) {
            this.games.delete(room);
        }
    }

    ready(room: string, playerId: string, ready: boolean): void {
        this.getGame(room).ready(playerId, ready);
    }

    rollDice(room: string, playerId: string) {
        return this.getGame(room).rollDice(playerId);
    }

    loseLife(room: string, playerId: string) {
        return this.getGame(room).loseLife(playerId);
    }

    chooseNextPlayer(room: string, playerId: string, nextPlayerId: string) {
        return this.getGame(room).chooseNextPlayer(playerId, nextPlayerId);
    }
}
