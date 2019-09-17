const path = require("path");
const http = require("http");
const socketIo = require("socket.io");

const express = require("express");

const port = process.env.PORT || 4000;
const index = require("./routes");

const app = express();
app.use(index);
app.use(express.static(path.join(__dirname, './client/build')));

const server = http.createServer(app);
const io = socketIo(server);

import { gameManager } from "./game";

io.on('connection', socket => {
    console.log('Socket connected: ' + socket.id);

    socket.on("handshake", (room) => {
        socket.join(room);

        if (!gameManager.hasGame(room)) {
            gameManager.createGame(room);
        }

        gameManager.joinGame(room, socket.id);

        socket.on('rollDice', () => {
            console.log('rolling dice in ' + room, socket.id);
            const result = { error: undefined, data: undefined };

            try {
                result.data = gameManager.rollDice(room, socket.id);
            } catch (err) {
                result.error = err.message;
            }

            io.to(room).emit('rolledDice', result);

        });
    });
});

server.listen(port, () => {
    console.log(`Server listening on port[${port}]`)
});

