export const REDIRECT_TO_HOME = "REDIRECT_TO_HOME";
export const REDIRECT_TO_GAME = "REDIRECT_TO_GAME";

export function redirectToHome() {
    return {
        type: REDIRECT_TO_HOME
    };
}

export function redirectToGame(room) {
    return {
        type: REDIRECT_TO_GAME,
        payload: room
    };
}
