import {ADD_FEED_MESSAGE} from "./feed.actions";

const initialState = {enabled: true, messages: []};
const feedReducer = (state = initialState, action) => {
    switch (action.type) {
        case "GAME_RESET":
            return {...state, ...initialState};
        case ADD_FEED_MESSAGE:
            return {
                ...state,
                messages: [...state.messages, action.payload]
            };
        default:
            return state;
    }
};

export default feedReducer;
