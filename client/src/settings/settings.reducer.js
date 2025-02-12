import { TOGGLE_FEED, TOGGLE_SOUND } from "./settings.actions";


const storedSettings = JSON.parse(localStorage.getItem("settings"));

let initialState = storedSettings ?? {
    feed: {
        enabled: true
    },
    sound: {
        enabled: true
    }
};


const settingsReducer = (state = initialState, action) => {
    switch (action.type) {
        case TOGGLE_FEED:
            return {
                ...state,
                feed: { ...state.feed, enabled: !state.feed.enabled }
            };
        case TOGGLE_SOUND:
            return {
                ...state,
                sound: { ...state.sound, enabled: !state.sound.enabled }
            };
        default:
            return state;
    }
};

export default settingsReducer;
