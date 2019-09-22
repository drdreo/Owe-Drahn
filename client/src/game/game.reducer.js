const initialState = {
    rolledDice: undefined,
    animatingDice: false,
    currentValue: 0,
    players: [],
    started: false,
    over: false,
    gameError: {
        noGame: false,
        notAllowed: false,
        notYourTurn: false
    }
};


const gameReducer = (state = initialState, action) => {
    switch (action.type) {
        case "GAME_UPDATE":
            return {
                ...state,
                ...{
                    players: action.payload.players,
                    started: action.payload.started,
                    over: action.payload.over,
                    currentValue: action.payload.currentValue
                }
            };

        case "GAME_ERROR":
            switch (action.payload.code) {
                case "NO_GAME":
                    return {...state, gameError: {noGame: true}};
                case "NOT_ALLOWED":
                    return {...state, gameError: {notAllowed: true}};
                case "NOT_YOUR_TURN":
                    return {...state, gameError: {notYourTurn: true}};
                default:
                    console.warn(`gameError sent:[${action.payload.message}] but isn't handled!`);
                    return state;
            }

        case "ROLLED_DICE":
            return {...state, rolledDice: action.payload};
        default:
            return state;
    }

};


export default gameReducer;
