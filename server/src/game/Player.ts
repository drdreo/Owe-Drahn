export interface FormattedPlayer {
    life: number;
    points: number;
    uid: string;
    username: string;
}

export class Player {

    isPlayersTurn: boolean = false;
    ready: boolean = false;
    life: number = 6;
    choosing: boolean = false;
    points: number = 0;
    connected: boolean = false;

    uid: string | null; // only set if User is logged in
    rank: number = 0;

    constructor(readonly id: string, readonly username: string) { }

    getFormattedPlayer(): FormattedPlayer {
        return {life: this.life, points: this.points, uid: this.uid || null, username: this.username};
    }
}
