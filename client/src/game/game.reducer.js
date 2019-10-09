import {Subject} from "rxjs";

const initialState = {
    rolledDice: undefined,
    rolledDice$: new Subject(undefined),
    currentValue: 0, // actual value from the server
    ui_currentValue: 0, // value to display delayed
    players: [],
    ui_players: [],
    started: false,
    over: false,
    gameError$: new Subject(undefined)
};

const gameReducer = (state = initialState, action) => {
    switch (action.type) {
        case "GAME_RESET":
            return {...state, ...initialState};
        case "GAME_INIT":
            return {...state, ...initialState, players: action.payload.players, ui_players: action.payload.players};
        case "GAME_STARTED":
            return {...state, started: true, over: false};
        case "GAME_UPDATE":
            return {
                ...state,
                players: action.payload.players,
                ui_players: action.payload.players,
                started: action.payload.started,
                over: action.payload.over,
                currentValue: action.payload.currentValue,
                ui_currentValue: action.payload.currentValue
            };
        case "GAME_OVER":
            return {...state, over: true, started: false};
        case "GAME_ERROR":
            state.gameError$.next(action.payload);
            return state;
        case "PLAYER_UPDATE":
            if (action.payload.updateUI) {
                return {...state, players: action.payload.players, ui_players: action.payload.players};
            }
            return {...state, players: action.payload.players};
        case "ROLLED_DICE":
            state.rolledDice$.next(action.payload);
            return {...state, currentValue: action.payload.total};
        case "ANIMATED_DICE":
            return {
                ...state,
                rolledDice: action.payload.dice,
                ui_currentValue: action.payload.total,
                ui_players: state.players
            };
        case "PLAYER_LOST_LIFE":
            return {...state, rolledDice: 0, ui_currentValue: 0};
        default:
            return state;
    }

};

export default gameReducer;
