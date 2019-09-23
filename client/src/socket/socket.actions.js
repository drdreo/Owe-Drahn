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

export const rolledDice = (data) => {
    return {
        type: "ROLLED_DICE",
        payload: data
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

