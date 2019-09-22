import {feedMessage, gameError, gameUpdate, playerLost, rolledDice} from "./socket.actions";

export default (store) => {
    const {socket} = store.getState().socket;

    socket.on("connect", () => console.log("Socket connected"));

    socket.on("gameUpdate", response => {
        store.dispatch(gameUpdate(response));
    });

    socket.on("gameError", data => {
        store.dispatch(gameError(data));
    });

    socket.on("rolledDice", data => {
        store.dispatch(rolledDice(data.dice));
        const total = store.getState().game.currentValue;
        store.dispatch(feedMessage({type: "ROLLED_DICE", username: data.player.username, dice: data.dice, total}));
    });

    socket.on("lostLife", (data) => {
        store.dispatch(feedMessage({type: "LOST_LIFE", username: data.player.username}));
    });

    socket.on("lost", (data) => {
        console.warn("PLAYER LOST: " + data.player.id);
        store.dispatch(playerLost(data.player.id));
        store.dispatch(feedMessage({type: "LOST", username: data.player.username}));
    });
}
