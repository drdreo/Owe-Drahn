export const TOGGLE_FEED = "TOGGLE_FEED";
export const TOGGLE_SOUND = "TOGGLE_SOUND";

export const toggleFeed = () => {
    return {
        type: TOGGLE_FEED
    };
};

export const toggleSound = () => {
    return {
        type: TOGGLE_SOUND
    };
};
