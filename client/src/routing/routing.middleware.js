import {push} from "connected-react-router";
import {REDIRECT_TO_GAME, REDIRECT_TO_HOME} from "./routing.actions";

const routingMiddleware = store => next => action => {
    if (action.type === REDIRECT_TO_HOME) {
        store.dispatch(push("/home"));
    } else if (action.type === REDIRECT_TO_GAME) {
        store.dispatch(push("/game/" + action.payload));
    }
    return next(action);
};

export default routingMiddleware;
