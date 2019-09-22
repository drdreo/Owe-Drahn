import {combineReducers} from "redux";
import feedReducer from "./game/Feed/feed.reducer";
import gameReducer from "./game/game.reducer";
import socketReducer from "./socket/socket.reducer";

export const allReducers = combineReducers({
    feed: feedReducer,
    game: gameReducer,
    socket: socketReducer
});
