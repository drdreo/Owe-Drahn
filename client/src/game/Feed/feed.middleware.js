import {feedMessage} from "./feed.actions";

export const feedMiddleware = store => next => action => {
    if (action.type === "GAME_OVER") {
        store.dispatch(feedMessage({type: "GAME_OVER", winner: action.payload}));
    }

    if (action.type === "PLAYER_LEFT") {
        store.dispatch(feedMessage({type: "PLAYER_LEFT", username: action.payload}));
    }

    return next(action);
};
