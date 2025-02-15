import {rolledDice} from "./socket.actions";
import {
    gameError,
    gameInit,
    gameOver,
    gameStarted,
    gameUpdate,
    playerUpdate,
    lostLife,
    playerLeft
} from "../game/game.actions";
import {feedMessage} from "../game/Feed/feed.actions";

export default (store) => {
    const {socket} = store.getState().socket;

    socket.on("connect", () => console.log("Socket connected!"));
    socket.on("disconnect", () => console.log("Socket disconnected!"));
}

export const initializeGameSocketListeners = (socket, dispatch) => {
    socket.on("gameInit", response => {
        dispatch(gameInit(response));
    });

    socket.on("gameStarted", response => {
        dispatch(gameStarted(response));
    });

    socket.on("gameUpdate", response => {
        dispatch(gameUpdate(response));
    });

    socket.on("gameOver", response => {
        dispatch(gameOver(response));
    });

    socket.on("gameError", data => {
        dispatch(gameError(data));
    });

    socket.on("playerUpdate", data => {
        dispatch(playerUpdate(data));
    });

    socket.on("playerLeft", data => {
        dispatch(playerLeft(data));
    });

    socket.on("rolledDice", data => {
        dispatch(rolledDice(data));
    });

    socket.on("lostLife", (data) => {
        dispatch(lostLife());
        dispatch(feedMessage({type: "LOST_LIFE", username: data.player.username}));
    });

    socket.on("lost", (data) => {
        // dispatch(playerLost(data.player.id));
        // dispatch(feedMessage({type: "LOST", username: data.player.username, dice: data.dice, total: data.total}));
    });

    return () => {
        socket.off("gameInit");
        socket.off("gameStarted");
        socket.off("gameUpdate");
        socket.off("gameOver");
        socket.off("gameError");
        socket.off("playerUpdate");
        socket.off("playerLeft");
        socket.off("rolledDice");
        socket.off("lostLife");
        socket.off("lost");
    };
};