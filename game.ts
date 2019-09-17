
class GameManager {

    games = new Map<string, Game>();

    getGame(room: string): Game {
        return this.games.get(room);
    }

    createGame(room: string) {
        this.games.set(room, new Game());
    }

    joinGame(room: string, socketId: string) {
        this.getGame(room).addPlayer(socketId);
    }

    rollDice(room: string, socketId: string) {
        return this.getGame(room).rollDice(socketId);
    }


}

class Game {

    players: Player[] = [];


    private isPlayersTurn(socketId: string) {
        return this.players.some(player => player.socketId === socketId && player.isPlayersTurn);
    }

    addPlayer(socketId) {
        this.players.push(new Player(socketId));
    }

    getNextPlayer() {
        return this.players.filter(player => player.isPlayersTurn);
    }

    rollDice(socketId: string): number {

        if (this.isPlayersTurn(socketId)) {
            const dice = Math.floor(Math.random() * 6) + 1;
            return dice;
        }

        throw Error("Not your turn!");
    }

}


class Player {

    isPlayersTurn: boolean = true;

    constructor(readonly socketId: string) {

    }
}

export const gameManager = new GameManager();