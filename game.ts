class GameManager {

    games = new Map<string, Game>();

    getGame(room: string): Game {
        return this.games.get(room);
    }

    getGameUpdate(room: string) {
        const game = this.getGame(room);
        if (game) {
            return {players: game.players, started: game.started, over: game.over, currentValue: game.currentValue};
        }

        return {players: undefined, started: undefined, over: undefined, currentValue: undefined};
    }

    hasGame(room: string): boolean {
        return this.games.has(room);
    }

    createGame(room: string): void {
        this.games.set(room, new Game());
    }

    joinGame(room: string, playerId: string, username: string): void {
        this.getGame(room).addPlayer(playerId, username);
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

class Game {

    players: Player[] = [];
    started: boolean = false;
    over: boolean = false;
    currentValue: number = 0;

    constructor() {
        this.init();
    }

    init() {
        this.started = false;
        this.over = false;
        this.currentValue = 0;
        this.players.map((player) => {
            player.isPlayersTurn = false;
            player.life = 6;
            player.ready = false;
        });
    }

    private isPlayersTurn(playerId: string) {
        return this.players.some(player => player.id === playerId && player.isPlayersTurn);
    }

    addPlayer(id: string, username: string) {
        this.players.push(new Player(id, username));
    }

    getPlayer(playerId: string): Player {
        return this.players.find(player => player.id === playerId);
    }

    // getNextPlayer() {
    //     return this.players.filter(player => player.isPlayersTurn);
    // }

    setNextPlayer(): boolean {
        const currentPlayerIndex = this.players.findIndex(player => player.isPlayersTurn);

        if (currentPlayerIndex === -1) {
            this.players[0].isPlayersTurn = true;
            return false;
        } else {
            this.players[currentPlayerIndex].isPlayersTurn = false;

            const playerLeft = this.players.filter(player => player.life > 0).length;
            if (playerLeft > 1) {
                let nextPlayerIndex;
                let i = currentPlayerIndex;
                do {
                    i++;
                    // check if it was last player
                    if (i >= this.players.length) {
                        i = 0;
                    }
                    nextPlayerIndex = i;

                    if (nextPlayerIndex === currentPlayerIndex) {
                        console.error('Failsafe shouldn\'t be triggered');
                        break;
                    }
                } while (this.players[nextPlayerIndex].life <= 0);
                this.players[nextPlayerIndex].isPlayersTurn = true;

                return false;
            } else {
                // game over
                this.over = true;
                return true;
            }
        }
    }

    rollDice(playerId: string): number | undefined {

        const player = this.getPlayer(playerId);
        if (this.isPlayersTurn(playerId) && player.life > 0) {
            const dice = Math.floor(Math.random() * 6) + 1;
            this.currentValue += dice;
            if (this.currentValue > 15) {
                this.currentValue = 0;
                player.life = 0;
                return undefined;
            }
            return dice;
        }

        throw Error('Not your turn!');
    }

    ready(playerId: string) {
        this.getPlayer(playerId).ready = true;
    }

    isEveryoneReady() {
        return this.players.every(player => player.ready);
    }

    loseLife(playerId: string) {
        const player = this.getPlayer(playerId);
        if (this.isPlayersTurn(playerId) && player.life > 0) {
            this.players.find(player => player.id === playerId).life--;
            this.currentValue = 0;
        } else {
            throw Error('You arent allowed to owe drahn!');
        }
    }
}

class Player {

    isPlayersTurn: boolean = false;
    ready: boolean = false;
    points: number = 0;
    life: number = 6;

    constructor(readonly id: string, readonly username: string) { }
}

export const gameManager = new GameManager();
