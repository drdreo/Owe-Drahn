export const gameReset = () => {
    return {
        type: "GAME_RESET"
    };
};

export const gameInit = (data) => {
    return {
        type: "GAME_INIT",
        payload: data
    };
};

export const gameStarted = () => {
    return {
        type: "GAME_STARTED"
    };
};

export const gameUpdate = (data) => {
    return {
        type: "GAME_UPDATE",
        payload: data
    };
};

export const gameOver = () => {
    return {
        type: "GAME_OVER"
    };
};

export const gameError = (data) => {
    return {
        type: "GAME_ERROR",
        payload: data
    };
};

export const playerUpdate = (data) => {
    return {
        type: "PLAYER_UPDATE",
        payload: data
    };
};


export const lostLife = () => {
    return {
        type: "PLAYER_LOST_LIFE"
    };
};

export const playerLost = (data) => {
    return {
        type: "PLAYER_LOST",
        payload: data
    };
};

export const animatedDice = (data) => {
    return {
        type: "ANIMATED_DICE",
        payload: data
    };
};
