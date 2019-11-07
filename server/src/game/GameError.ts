export enum GameErrorCode {
    NOT_ALLOWED = 'NOT_ALLOWED',
    NOT_YOUR_TURN = 'NOT_YOUR_TURN',
    NO_GAME = 'NO_GAME',
    NO_PLAYER = 'NO_PLAYER',
    GAME_STARTED = 'GAME_STARTED'
}

export interface GameError {
    message: string;
    code: GameErrorCode;
}
