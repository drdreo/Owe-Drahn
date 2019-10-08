import { Service } from 'typedi';
import { Game } from './Game';
import { Observable } from 'rxjs';
import { Command } from './Command';

@Service()
export class GameService {

    private games = new Map<string, Game>();

    createGame(room: string): void {
        this.games.set(room, new Game());
    }

    getGame(room: string): Game {
        return this.games.get(room);
    }

    hasGame(room: string): boolean {
        return this.games.has(room);
    }

    hasGameStarted(room: string): boolean {
        return this.games.get(room).started;
    }

    removeIfPlayer(playerId: string): boolean {
        let playersRoom;
        for (let [room, game] of this.games) {
            if (game.isPlayer(playerId)) {
                playersRoom = room;
                this.leave(room, playerId);
                break;
            }
        }
        return !!playersRoom;
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

    leave(room: string, playerId: string): boolean {
        const game = this.getGame(room);
        if (game) {
            game.leave(playerId);
            // clean up game
            if (!game.hasPlayers()) {
                console.warn(`Removing game[${room}]`);
                this.games.delete(room);
            }
            return true;
        }
        return false;
    }

    ready(room: string, playerId: string, ready: boolean): void {
        const game = this.getGame(room);
        if (game) {
            game.ready(playerId, ready);
        }
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
