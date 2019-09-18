export class Player {

    isPlayersTurn: boolean = false;
    ready: boolean = false;
    points: number = 0;
    life: number = 6;

    constructor(readonly id: string, readonly username: string) { }
}
