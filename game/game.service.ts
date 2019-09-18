import { Service } from 'typedi';
import { Game } from './Game';

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

    getGameCommand(room: string) {
        return this.getGame(room).command$;
    }


    ready(room: string, playerId: string): void {
        this.getGame(room).ready(playerId);
    }

    rollDice(room: string, playerId: string) {
        return this.getGame(room).rollDice(playerId);
    }

    loseLife(room: string, playerId: string) {
        return this.getGame(room).loseLife(playerId);
    }
}
