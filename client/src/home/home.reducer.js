// client/src/home/home.reducer.js
import {GAME_OVERVIEW} from './home.actions';

const initialState = {
    overview: {rooms: [], totalPlayers: 0},
};

const homeReducer = (state = initialState, action) => {
    switch (action.type) {
        case GAME_OVERVIEW:
            return {
                ...state,
                overview: action.payload
            };
        default:
            return state;
    }
};

export default homeReducer;