const feedReducer = (state = {enabled: true, messages: []}, action) => {
    switch (action.type) {
        case "ADD_FEED_MESSAGE":
            return {
                ...state,
                messages: [...state.messages, action.payload]
            };

        default:
            return state;
    }
};

export default feedReducer;
