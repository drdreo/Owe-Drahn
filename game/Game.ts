import { Player } from './Player';
import { Subject } from 'rxjs';
import { Command } from './Command';

export class Game {

    players: Player[] = [];
    started: boolean = false;
    over: boolean = false;
    currentValue: number = 0;

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

    addPlayer(id: string, username: string) {
        this.players.push(new Player(id, username));
    }

    getPlayer(playerId: string): Player {
        return this.players.find(player => player.id === playerId);
    }

    private isPlayersTurn(playerId: string) {
        return this.players.some(player => player.id === playerId && player.isPlayersTurn);
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

    sendGameError(message: string) {
        this._command$.next({eventName: 'gameError', data: message});
    }

    // getNextPlayer() {
    //     return this.players.filter(player => player.isPlayersTurn);
    // }

    setNextPlayer(): void {
        const currentPlayerIndex = this.players.findIndex(player => player.isPlayersTurn);

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
                // game over
                this.over = true;
                this.sendGameOver();
                // restart after 5s
                setTimeout(() => {
                    this.init();
                    this.sendGameUpdate();
                }, 5000);
            }

        }

        this.sendGameUpdate();
    }

    rollDice(playerId: string): number | undefined {

        const player = this.getPlayer(playerId);
        if (this.isPlayersTurn(playerId)) {
            const dice = Math.floor(Math.random() * 6) + 1;

            // Rule of 3, doesn't count
            if (dice !== 3) {
                this.currentValue += dice;
            }

            if (this.currentValue > 15) {
                this.currentValue = 0;
                player.life = 0;
                return dice;
            }
            return dice;
        }

        throw Error('Not your turn!');
    }

    ready(playerId: string) {
        this.getPlayer(playerId).ready = true;

        // check if everyone is ready
        if (this.isEveryoneReady()) {
            this.setNextPlayer();
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
            this.currentValue = 0;

            // TODO: player chooses next player;
            this.setNextPlayer();
        } else {
            this.sendGameError('You arent allowed to owe drahn!');
        }
    }

    joinGame(playerId: string, username: string) {
        if (!this.started) {
            this.addPlayer(playerId, username);
        }
    }
}

