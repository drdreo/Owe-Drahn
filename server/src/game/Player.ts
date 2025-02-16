export type FormattedPlayer = {
    life: number;
    points: number;
    uid: string | null;
    username: string;
    rank: number;
}

export type PlayerStats = {
    maxLifeLoss: number;
    id: string;
    rolledDice: number[];
    perfectRoll: number;
    worstRoll: number;
    luckiestRoll: number;
    totalGames: number;
    rolled21: number;
    wins: number;
};

export class Player {
    isPlayersTurn: boolean = false;
    ready: boolean = false;
    life: number = 6;
    choosing: boolean = false;
    points: number = 0;
    connected: boolean = false;

    uid: string | null; // only set if User is logged in
    rank: number = 0;

    get stats(): PlayerStats {
        return this._stats;
    }

    set stats(stats: PlayerStats) {
        this._stats = stats;
        this.rank = this.calculateRank(stats.totalGames);
    }

    private _stats: PlayerStats; // only set if User is logged in

    constructor(
        readonly id: string,
        readonly username: string
    ) {}

    getFormattedPlayer(): FormattedPlayer {
        return {
            life: this.life,
            points: this.points,
            uid: this.uid || null,
            username: this.username,
            rank: this.rank
        };
    }

    private calculateRank(totalGames: number): number {
        return Math.floor(totalGames / 10) + totalGames;
    }

    toJSON() {
        return {
            id: this.id,
            uid: this.uid,
            connected: this.connected,
            username: this.username,
            ready: this.ready,
            isPlayersTurn: this.isPlayersTurn,
            choosing: this.choosing,
            life: this.life,
            points: this.points,
            rank: this.rank,
            stats: this.stats
        };
    }
}
