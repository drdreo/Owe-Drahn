export class Player {

    isPlayersTurn: boolean = false;
    ready: boolean = false;
    life: number = 6;
    choosing: boolean = false;
    points: number = 0;
    connected: boolean = false;

    uid: string; // only set if User is logged in

    constructor(readonly id: string, readonly username: string) { }
}
