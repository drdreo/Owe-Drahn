import {gameError, gameUpdate, playerLost, rolledDice} from "./socket.actions";

export default (store) => {
    const socket = store.getState().socket.socket;
    console.log(socket);
    socket.on("connect", () => console.log("Socket connected"));

    socket.on("gameUpdate", response => {
        console.log("gameUpdate", response);
        store.dispatch(gameUpdate(response));
    });

    socket.on("gameError", data => {
        console.error(data);
        store.dispatch(gameError(data));
    });

    socket.on("rolledDice", value => {
        store.dispatch(rolledDice(value));

    });

    socket.on("lost", (data) => {
        console.warn("PLAYER LOST: " + data.playerId);
        store.dispatch(playerLost(data));

    });
}
