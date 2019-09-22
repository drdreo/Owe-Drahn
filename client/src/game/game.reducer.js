import { Subject} from "rxjs";

const initialState = {
    rolledDice: undefined,
    rolledDice$: new Subject(undefined),
    animatingDice: false,
    currentValue: 0,
    players: [],
    started: false,
    over: false,
    gameError$: new Subject(undefined)
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
            state.gameError$.next(action.payload);
            return state;

        case "ROLLED_DICE":
            state.rolledDice$.next(action.payload);
            return {...state, rolledDice: action.payload};
        default:
            return state;
    }

};


export default gameReducer;
