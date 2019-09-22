const feedReducer = (state = [], action) => {
    switch (action.type) {
        case "NEW_MESSAGE":
            return state.push(action.payload);

        default:
            return state;
    }
};

export default feedReducer;
