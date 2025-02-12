import { FormattedPlayer, Player } from './Player';
import { Subject } from 'rxjs';
import { Command } from './Command';
import { GameError, GameErrorCode } from './GameError';
import { FirestoreDate } from '../db/db.service';

export interface Rolls {
    player: FormattedPlayer;
    dice: number;
    total: number;
}

export interface FormattedGame {
    players: FormattedPlayer[];
    rolls: Rolls[];
    startedAt: Date | FirestoreDate;
    finishedAt: Date | FirestoreDate;
}

export interface GameUpdate {
    players: Player[];
    currentValue: number;
    started: boolean;
    over: boolean;
}

export class Game {
    private players: Player[] = [];
    started: boolean = false;
    private over: boolean = false;
    private currentValue: number = 0;

    private rolls: Rolls[] = [];
    private _command$ = new Subject<Command>();
    command$ = this._command$.asObservable();

    startedAt: Date;
    finishedAt: Date;

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

        this.rolls = [];
    }

    private addPlayer(id: string, username: string) {
        this.players.push(new Player(id, username));
    }

    private getPlayer(playerId: string): Player {
        return this.players.find((player) => player.id === playerId);
    }

    private isPlayersTurn(playerId: string) {
        return this.players.some(
            (player) => player.id === playerId && player.isPlayersTurn
        );
    }

    private getCurrentPlayer(): Player {
        return this.players.filter((player) => player.isPlayersTurn)[0];
    }

    private isEveryoneReady() {
        return this.players.every((player) => player.ready);
    }

    isPlayer(playerId: string): boolean {
        return this.players.some((player) => player.id === playerId);
    }

    hasPlayers() {
        return this.players.length > 0;
    }

    getPlayers(): Player[] {
        return this.players;
    }

    /**
     * @returns the players with life left
     */
    getPlayersLeft(): Player[] {
        return this.players.filter((player) => player.life > 0);
    }

    getRegisteredPlayers(): Player[] {
        return this.players.filter((player) => player.uid);
    }

    getFormattedPlayers(): FormattedPlayer[] {
        return this.players.map((player) => player.getFormattedPlayer());
    }

    getRolls(): Rolls[] {
        return this.rolls;
    }

    isPlayerConnected(playerId: string) {
        return this.getPlayer(playerId).connected;
    }

    getGameUpdate(): GameUpdate {
        return {
            players: this.players,
            currentValue: this.currentValue,
            started: this.started,
            over: this.over
        };
    }

    removePlayer(index: number) {
        this.sendPlayerLeft(this.players[index].username);
        this.players.splice(index, 1);
    }

    sendGameInit() {
        this._command$.next({
            eventName: 'gameInit',
            data: this.getGameUpdate()
        });
    }

    sendGameUpdate() {
        this._command$.next({
            eventName: 'gameUpdate',
            data: this.getGameUpdate()
        });
    }

    sendGameOver(winner: string) {
        this._command$.next({ eventName: 'gameOver', data: winner });
    }

    sendGameError(error: GameError) {
        this._command$.next({ eventName: 'gameError', data: error });
    }

    sendPlayerUpdate(updateUI: boolean = false) {
        this._command$.next({
            eventName: 'playerUpdate',
            data: { players: this.players, updateUI }
        });
    }

    sendPlayerLeft(username: string) {
        this._command$.next({ eventName: 'playerLeft', data: username });
    }

    /**
     * When a Player "draht owe", he can choose who starts next.
     * Only let player choose next if:
     *  1. it's his turn
     *  2. He is choosing. Is set after he "drahs owe"
     *  3. Chose Player is still alive. (prevent choosing of already lost players)
     * @param playerId - The player who chooses the next one.
     * @param nextPlayerId - The chosen palyerId.
     */
    chooseNextPlayer(playerId: string, nextPlayerId: string) {
        const currentPlayer = this.getCurrentPlayer();
        const nextPlayer = this.getPlayer(nextPlayerId);
        if (
            currentPlayer.id === playerId &&
            currentPlayer.choosing &&
            nextPlayer.life > 0
        ) {
            currentPlayer.isPlayersTurn = false;
            nextPlayer.isPlayersTurn = true;
            currentPlayer.choosing = false;
        }

        this.sendPlayerUpdate(true);
    }

    /**
     * The next-player algorithm.
     * Always chooses the next player in the array order. If last, start at first.
     *
     * Determines if the game is over, when no players are left.
     */
    setNextPlayer(): void {
        const currentPlayerIndex = this.players.findIndex(
            (player) => player.isPlayersTurn
        );

        // start of the game, nobodys turn
        if (currentPlayerIndex === -1) {
            this.players[0].isPlayersTurn = true;
        } else {
            this.players[currentPlayerIndex].isPlayersTurn = false;

            const playersLeft = this.getPlayersLeft();
            if (playersLeft.length > 1) {
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
                        console.error("Failsafe shouldn't be triggered");
                        break;
                    }
                } while (this.players[nextPlayerIndex].life <= 0);
                this.players[nextPlayerIndex].isPlayersTurn = true;
            } else {
                const winner = playersLeft[0];
                this.gameOver(winner.username);
            }
        }

        if (!this.over) {
            this.sendPlayerUpdate();
        }
    }

    setNextPlayerRandom() {
        let playerIndex;
        do {
            playerIndex = random(0, this.players.length - 1);
        } while (this.players[playerIndex].life <= 0);

        this.players[playerIndex].isPlayersTurn = true;

        this.sendPlayerUpdate();
    }

    rollDice(playerId: string) {
        const player = this.getPlayer(playerId);
        if (this.isPlayersTurn(playerId)) {
            const dice = random(1, 6);
            let total;

            // Rule of 3, doesn't count
            if (dice != 3) {
                this.currentValue += dice;
            }
            total = this.currentValue;

            this.rolls.push({
                player: player.getFormattedPlayer(),
                dice,
                total
            });

            if (this.currentValue > 15) {
                player.life = 0;
                this.currentValue = 0;
            }

            this._command$.next({
                eventName: 'rolledDice',
                data: { dice, player, total }
            });

            if (player.choosing) {
                player.choosing = false;
            }

            this.setNextPlayer();
        } else {
            this.sendGameError({
                code: GameErrorCode.NOT_YOUR_TURN,
                message: 'Not your turn!'
            });
        }
    }

    connect(playerId: string, uid?: string, rank?: number) {
        const player = this.getPlayer(playerId);
        if (player) {
            player.connected = true;
            if (uid) {
                console.log(`User[${uid}] connected to player[${playerId}]`);
                player.uid = uid;
                if (rank) {
                    player.rank = rank;
                }
            }
        } else {
            this.sendGameError({
                code: GameErrorCode.NO_PLAYER,
                message: 'You are not part of this game!'
            });
        }
    }

    disconnect(playerId: string) {
        const player = this.getPlayer(playerId);
        if (player) {
            this.getPlayer(playerId).connected = false;
        } else {
            this.sendGameError({
                code: GameErrorCode.NO_PLAYER,
                message: 'You are not part of this game!'
            });
        }
    }

    leave(playerId: string) {
        const playerIndex = this.players.findIndex(
            (player) => player.id === playerId
        );
        if (playerIndex !== -1) {
            if (this.players.length > 2) {
                // set new player, then remove the leaver and send update
                if (this.players[playerIndex].isPlayersTurn) {
                    this.setNextPlayer();
                }
                this.removePlayer(playerIndex);
                this.sendPlayerUpdate(true);
            } else {
                // remove player, tell the last player about the leaver and send gameOver if he is last
                this.removePlayer(playerIndex);
                this.sendPlayerUpdate(true);
                if (this.started && this.players.length > 0) {
                    this.gameOver(this.players[0].username);
                }
            }
        }
    }

    ready(playerId: string, ready: boolean) {
        const player = this.getPlayer(playerId);
        if (player) {
            player.ready = ready ? ready : false;

            // check if everyone is ready
            if (this.isEveryoneReady()) {
                this.started = true;
                this.startedAt = new Date();
                this._command$.next({ eventName: 'gameStarted' });

                this.setNextPlayerRandom();
                // reset everyones ready state for UI reasons
                this.players.map((player) => (player.ready = false));
            }
            // this.sendGameUpdate();
            this.sendPlayerUpdate(true);
        } else {
            this.sendGameError({
                code: GameErrorCode.NO_PLAYER,
                message: 'You are not part of this game!'
            });
        }
    }

    loseLife(playerId: string) {
        const player = this.getPlayer(playerId);
        if (
            this.isPlayersTurn(playerId) &&
            player.life > 1 &&
            !player.choosing
        ) {
            player.life--;
            player.choosing = true;
            this.currentValue = 0;
            this.sendGameUpdate();
            this._command$.next({ eventName: 'lostLife', data: { player } });
        } else {
            this.sendGameError({
                code: GameErrorCode.NOT_ALLOWED,
                message: 'You arent allowed to owe drahn!'
            });
        }
    }

    join(playerId: string, username: string) {
        if (!this.started) {
            this.addPlayer(playerId, username);
        }
    }

    gameOver(winner: string) {
        // game over
        this.over = true;
        this.finishedAt = new Date();
        this.sendGameOver(winner);
        // restart after 5s
        setTimeout(() => {
            this.init();
            this.sendGameInit();
        }, 5000);
    }

    format(): FormattedGame {
        return {
            startedAt: this.startedAt,
            finishedAt: this.finishedAt,
            players: this.getFormattedPlayers(),
            rolls: this.getRolls()
        };
    }
}

function random(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
