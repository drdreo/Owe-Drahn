import {TOGGLE_FEED, TOGGLE_SOUND} from "./settings.actions";


const initialState = {
    feed: {
        enabled: true
    },
    sound: {
        enabled: false
    }
};

const settingsReducer = (state = initialState, action) => {
    switch (action.type) {
        case TOGGLE_FEED:
            return {
                ...state,
                feed: {...state.feed, enabled: !state.feed.enabled}
            };
        case TOGGLE_SOUND:
            return {
                ...state,
                sound: {...state.sound, enabled: !state.sound.enabled}
            };
        default:
            return state;
    }
};

export default settingsReducer;
