import { Player } from './Player';
import { Subject } from 'rxjs';
import { Command } from './Command';
import { GameError, GameErrorCode } from './GameError';


export class Game {

    private players: Player[] = [];
    started: boolean = false;
    private over: boolean = false;
    private currentValue: number = 0;

    private _command$ = new Subject<Command>();
    command$ = this._command$.asObservable();

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

    private addPlayer(id: string, username: string) {
        this.players.push(new Player(id, username));
    }

    private getPlayer(playerId: string): Player {
        return this.players.find(player => player.id === playerId);
    }

    private isPlayersTurn(playerId: string) {
        return this.players.some(player => player.id === playerId && player.isPlayersTurn);
    }

    private getCurrentPlayer(): Player {
        return this.players.filter(player => player.isPlayersTurn)[0];
    }

    hasPlayers() {
        return !!this.players.length;
    }

    isPlayer(playerId: string): boolean {
        return this.players.some(player => player.id === playerId);
    }

    isPlayerConnected(playerId: string) {
        return this.getPlayer(playerId).connected;
    }

    getGameUpdate() {
        return {players: this.players, started: this.started, over: this.over, currentValue: this.currentValue};
    }

    sendGameUpdate() {
        this._command$.next({eventName: 'gameUpdate', data: this.getGameUpdate()});
    }

    sendGameOver() {
        this._command$.next({eventName: 'gameOver'});
    }

    sendGameError(error: GameError) {
        this._command$.next({eventName: 'gameError', data: error});
    }


    chooseNextPlayer(playerId: string, nextPlayerId: string) {
        const currentPlayer = this.getCurrentPlayer();
        if (currentPlayer.id === playerId && currentPlayer.choosing) {
            currentPlayer.isPlayersTurn = false;
            this.getPlayer(nextPlayerId).isPlayersTurn = true;
            currentPlayer.choosing = false;
        }

        this.sendGameUpdate();
    }

    setNextPlayer(): void {
        const currentPlayerIndex = this.players.findIndex(player => player.isPlayersTurn);

        // start of the game, nobodys turn
        if (currentPlayerIndex === -1) {
            this.players[0].isPlayersTurn = true;
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
            } else {
                this.gameOver();
            }

        }

        this.sendGameUpdate();
    }

    setNextPlayerRandom() {
        let playerIndex;
        do {
            playerIndex = random(0, this.players.length - 1);
        } while (this.players[playerIndex].life <= 0);

        this.players[playerIndex].isPlayersTurn = true;

        this.sendGameUpdate();
    }

    rollDice(playerId: string) {

        const player = this.getPlayer(playerId);
        if (this.isPlayersTurn(playerId)) {
            const dice = random(1, 6);

            // Rule of 3, doesn't count
            if (dice != 3) {
                this.currentValue += dice;
            }

            if (this.currentValue > 15) {
                this.currentValue = 0;
                player.life = 0;
                this._command$.next({eventName: 'lost', data: {playerId}});
            }
            this.setNextPlayer();

            if (player.choosing) {
                player.choosing = false;
            }

            this._command$.next({eventName: 'rolledDice', data: dice});
            this.sendGameUpdate();
        } else {
            this.sendGameError({code: GameErrorCode.NOT_YOUR_TURN, message: 'Not your turn!'});

        }
    }

    connect(playerId: string) {
        this.getPlayer(playerId).connected = true;
    }

    disconnect(playerId: string) {
        this.getPlayer(playerId).connected = false;
    }

    leave(playerId: string) {
        const playerIndex = this.players.findIndex(player => player.id === playerId);
        if (playerIndex !== -1) {
            if (this.players[playerIndex].isPlayersTurn && this.players.length > 1) {
                this.setNextPlayer();
                this.players.splice(playerIndex, 1);
                this.sendGameUpdate();
            } else {
                this.players.splice(playerIndex, 1);
                this.gameOver();
            }

        }
    }

    ready(playerId: string, ready: boolean) {
        this.getPlayer(playerId).ready = ready;

        // check if everyone is ready
        if (this.isEveryoneReady()) {
            this.setNextPlayerRandom();
            this.started = true;
            // reset everyones ready state for UI reasons
            this.players.map(player => player.ready = false);
        }
        this.sendGameUpdate();
    }

    isEveryoneReady() {
        return this.players.every(player => player.ready);
    }

    loseLife(playerId: string) {
        const player = this.getPlayer(playerId);
        if (this.isPlayersTurn(playerId) && player.life > 1) {
            player.life--;
            player.choosing = true;
            this.currentValue = 0;
            this.sendGameUpdate();
        } else {
            this.sendGameError({code: GameErrorCode.NOT_ALLOWED, message: 'You arent allowed to owe drahn!'});
        }
    }

    joinGame(playerId: string, username: string) {
        if (!this.started) {
            this.addPlayer(playerId, username);
        }
    }

    gameOver() {
        // game over
        this.over = true;

        if (this.players.length > 0) {
            this.sendGameOver();
            // restart after 5s
            setTimeout(() => {
                this.init();
                this.sendGameUpdate();
            }, 5000);
        }
    }

}


function random(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
