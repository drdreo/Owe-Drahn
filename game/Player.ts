export class Player {

    isPlayersTurn: boolean = false;
    ready: boolean = false;
    life: number = 6;
    choosing: boolean = false;
    points: number = 0;
    connected: boolean = false;

    constructor(readonly id: string, readonly username: string) { }
}
