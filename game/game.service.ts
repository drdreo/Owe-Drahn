import { Service } from 'typedi';
import { Game } from './Game';

@Service()
export class GameService {

    private games = new Map<string, Game>();

    constructor() {

    }

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

    isEveryoneReady(room: string): boolean {
        return this.getGame(room).isEveryoneReady();
    }

    nextPlayer(room: string): Promise<void> {
        const game = this.getGame(room);
        const over = game.setNextPlayer();

        return new Promise<void>((resolve, reject) => {
                if (over) {
                    // restart after 5s
                    setTimeout(() => {
                        game.init();
                        resolve();
                    }, 5000);
                } else {
                    resolve();
                }
            },
        );

    }

    rollDice(room: string, playerId: string) {
        return this.getGame(room).rollDice(playerId);
    }

    loseLife(room: string, playerId: string) {
        return this.getGame(room).loseLife(playerId);
    }

}
