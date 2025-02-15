export const ADD_FEED_MESSAGE = "ADD_FEED_MESSAGE";

export const feedMessage = (data) => {
    return {
        type: ADD_FEED_MESSAGE,
        payload: data
    };
};
