import {combineReducers} from "redux";
import {connectRouter} from "connected-react-router";

import authReducer from "./auth/auth.reducer";
import feedReducer from "./game/Feed/feed.reducer";
import gameReducer from "./game/game.reducer";
import socketReducer from "./socket/socket.reducer";
import settingsReducer from "./settings/settings.reducer";

export const allReducers = (history) => combineReducers({
    router: connectRouter(history),
    auth: authReducer,
    feed: feedReducer,
    game: gameReducer,
    socket: socketReducer,
    settings: settingsReducer
});
