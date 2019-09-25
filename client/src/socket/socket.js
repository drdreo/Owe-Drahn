import {rolledDice} from "./socket.actions";
import {gameError, gameInit, gameOver, gameStarted, gameUpdate, lostLife} from "../game/game.actions";
import {feedMessage} from "../game/Feed/feed.actions";

export default (store) => {
    const {socket} = store.getState().socket;

    socket.on("connect", () => console.log("Socket connected"));

    socket.on("gameInit", response => {
        store.dispatch(gameInit(response));
    });

    socket.on("gameStarted", response => {
        store.dispatch(gameStarted(response));
    });

    socket.on("gameUpdate", response => {
        store.dispatch(gameUpdate(response));
    });

    socket.on("gameOver", response => {
        store.dispatch(gameOver(response));
    });

    socket.on("gameError", data => {
        store.dispatch(gameError(data));
    });

    socket.on("rolledDice", data => {
        store.dispatch(rolledDice(data));
    });

    socket.on("lostLife", (data) => {
        store.dispatch(lostLife());
        store.dispatch(feedMessage({type: "LOST_LIFE", username: data.player.username}));
    });

    socket.on("lost", (data) => {
        // store.dispatch(playerLost(data.player.id));
        // store.dispatch(feedMessage({type: "LOST", username: data.player.username, dice: data.dice, total: data.total}));
    });
}
