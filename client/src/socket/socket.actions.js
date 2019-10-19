export const CONNECTION_HANDSHAKE = "CONNECTION_HANDSHAKE";
export const PLAYER_READY = "PLAYER_READY";
export const PLAYER_ROLL_DICE = "PLAYER_ROLL_DICE";
export const ROLLED_DICE = "ROLLED_DICE";
export const PLAYER_LOSE_LIFE = "PLAYER_LOSE_LIFE";
export const PLAYER_CHOOSE_NEXT = "PLAYER_CHOOSE_NEXT";

export const handshake = (room, uid) => {
    return {
        type: CONNECTION_HANDSHAKE,
        payload: {room, uid}
    };
};

export const ready = (ready) => {
    return {
        type: PLAYER_READY,
        payload: ready
    };
};

export const rollDice = () => {
    return {
        type: PLAYER_ROLL_DICE
    };
};

export const rolledDice = (data) => {
    return {
        type: ROLLED_DICE,
        payload: data
    };
};

export const loseLife = () => {
    return {
        type: PLAYER_LOSE_LIFE
    };
};

export const chooseNextPlayer = (playerId) => {
    return {
        type: PLAYER_CHOOSE_NEXT,
        payload: playerId
    };
};

