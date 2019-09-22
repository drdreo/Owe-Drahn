import socketIOClient from "socket.io-client";

const SERVER_URL = process.env.REACT_APP_DOMAIN;

const io = socketIOClient(SERVER_URL);

const socketReducer = (state = {socket: io}, action) => {
    switch (action.type) {
        case "CONNECTION_HANDSHAKE":
            state.socket.emit("handshake", {playerId: sessionStorage.getItem("playerId"), room: action.payload});
            return state;
        case "PLAYER_READY":
            state.socket.emit("ready", action.payload);
            return state;
        case "PLAYER_ROLL_DICE":
            state.socket.emit("rollDice");
            return state;
        case "PLAYER_CHOOSE_NEXT":
            state.socket.emit("chooseNextPlayer", action.payload);
            return state;
        default:
            return state;
    }
};

export default socketReducer;
