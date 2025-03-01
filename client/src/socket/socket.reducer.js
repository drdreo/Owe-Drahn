import socketIOClient from "socket.io-client";
import {
    CONNECTION_HANDSHAKE,
    PLAYER_CHOOSE_NEXT,
    PLAYER_LOSE_LIFE,
    PLAYER_READY,
    PLAYER_ROLL_DICE
} from "./socket.actions";

const SERVER_URL = import.meta.env.VITE_DOMAIN;

const io = socketIOClient(SERVER_URL, {
    transports: ['websocket'],
    withCredentials: true
});

const initialState = {socket: io};
const socketReducer = (state = initialState, action) => {
    switch (action.type) {
        case "GAME_RESET":
            state.socket.emit("leave");
            return state;
        case CONNECTION_HANDSHAKE:
            state.socket.emit("handshake", {playerId: localStorage.getItem("playerId"), room: action.payload.room, uid: action.payload.uid});
            return state;
        case PLAYER_READY:
            state.socket.emit("ready", action.payload);
            return state;
        case PLAYER_ROLL_DICE:
            state.socket.emit("rollDice");
            return state;
        case PLAYER_LOSE_LIFE:
            state.socket.emit("loseLife");
            return state;
        case PLAYER_CHOOSE_NEXT:
            state.socket.emit("chooseNextPlayer", action.payload);
            return state;
        default:
            return state;
    }
};

export default socketReducer;
