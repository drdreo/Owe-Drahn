const path = require('path');
const http = require('http');
const socketIo = require('socket.io');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');

const port = process.env.PORT || 4000;
const router = require('./routes');
import { gameManager } from './game';

const app = express();

app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: true,
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24,
    },
}));


// Express Routers
app.use('/', router);
app.use(express.static(path.join(__dirname, './client/build')));


const server = http.createServer(app);
const io = socketIo(server);

io.on('connection', socket => {
    console.log('Socket connected: ' + socket.id);
    socket.on('disconnect', () => {
        console.log('Socket disconnected ' + socket.id);
    });

    socket.on('handshake', (handshakeData) => {
        const {room, playerId} = handshakeData;

        socket.join(room);

        // someone joined, update others
        const result = {error: undefined, data: undefined};
        result.data = gameManager.getGameUpdate(room);
        io.to(room).emit('gameUpdate', result);

        socket.on('ready', () => {
            const result = {error: undefined, data: undefined};

            gameManager.ready(room, playerId);

            // check if everyone is ready
            if (gameManager.isEveryoneReady(room)) {
                gameManager.nextPlayer(room);
                const game = gameManager.getGame(room);
                game.started = true;
                // reset everyones ready state for UI reasons
                game.players.map(player => player.ready = false);
            }

            result.data = gameManager.getGameUpdate(room);

            io.to(room).emit('gameUpdate', result);
        });

        socket.on('rollDice', () => {
            try {
                let rolledDice = gameManager.rollDice(room, playerId);
                if (rolledDice) {
                    io.to(room).emit('rolledDice', {data: rolledDice});
                } else {
                    io.to(room).emit('lost', {playerId});
                }

                // send the reset delayed
                gameManager.nextPlayer(room).then(() => {
                    const data = gameManager.getGameUpdate(room);
                    io.to(room).emit('gameUpdate', {data});
                });

                const data = gameManager.getGameUpdate(room);
                io.to(room).emit('gameUpdate', {data});

            } catch (err) {
                io.to(room).emit('gameError', err.message);
            }
        });

        socket.on('loseLife', () => {
            try {
                gameManager.loseLife(room, playerId);
                gameManager.nextPlayer(room);

                const data = gameManager.getGameUpdate(room);
                io.to(room).emit('gameUpdate', {data});
            } catch (err) {
                io.to(room).emit('gameError', err.message);
            }
        });
    });
});

server.listen(port, () => {
    console.log(`Server listening on port[${port}]`);
});

