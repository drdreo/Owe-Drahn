
export const handshake = (room) => {
    return {
        type: "CONNECTION_HANDSHAKE",
        payload: room
    };
};

export const ready = (ready) => {
    return {
        type: "PLAYER_READY",
        payload: ready
    };
};

export const rollDice = () => {
    return {
        type: "PLAYER_ROLL_DICE"
    };
};

export const rolledDice = (value) => {
    return {
        type: "ROLLED_DICE",
        payload: value
    };
};

export const loseLife = () => {
    return {
        type: "PLAYER_LOSE_LIFE"
    };
};

export const chooseNextPlayer = (playerId) => {
    return {
        type: "PLAYER_CHOOSE_NEXT",
        payload: playerId
    };
};

export const gameUpdate = (data) => {
    return {
        type: "GAME_UPDATE",
        payload: data
    };
};

export const gameError = (data) => {
    return {
        type: "GAME_ERROR",
        payload: data
    };
};

export const feedMessage = (data) => {
    return {
        type: "ADD_FEED_MESSAGE",
        payload: data
    };
};

export const playerLost = (data) => {
    return {
        type: "PLAYER_LOST",
        payload: data
    };
}
