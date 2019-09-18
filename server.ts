import 'reflect-metadata';
import { Container } from 'typedi';
import { GameService } from './game/game.service';
import { SocketService } from './socket.service';

import * as http from 'http';
import * as express from 'express';
import * as cors from 'cors';
import * as path from 'path';

const session = require('express-session');
import * as bodyParser from 'body-parser';
import uuid = require('uuid');
import { Request, Response } from 'express';

const port = process.env.PORT || 4000;
const app = express();

let gameService = Container.get<GameService>(GameService);
let socketService = Container.get<SocketService>(SocketService);

const whitelist = [
    'http://localhost:3000',
    'http://localhost:4000',
    'https://owe-drahn.herokuapp.com/',
];

app.use(cors({
    credentials: true,
    origin: (origin: string, callback: Function) => {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
}));

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
app.get('/api/join', (req: any, res: Response) => {
    const room = req.query.room;
    const username = req.query.username;
    const playerId = req.session.playerId ? req.session.playerId : uuid.v4();

    if (room) {
        req.session.playerId = playerId;

        if (!gameService.hasGame(room)) {
            gameService.createGame(room);
            socketService.subscribeToGame(room);
        }

        gameService.joinGame(room, playerId, username);

        res.json({error: undefined, playerId});
    } else {
        res.status(500).send('No room code provided!');
    }
});

app.use(express.static(path.join(__dirname, './client/build')));

// general catch all
app.get(/^((?!\/api).)*$/, (req, res) => {
    console.log('serving: ' + path.join(__dirname, './client/build/index.html'));
    res.sendFile(path.join(__dirname, './client/build/index.html'));
});

const server = http.createServer(app);
socketService.connect(server);

// io.on('connection', socket => {
//     console.log('Socket connected: ' + socket.id);
//     socket.on('disconnect', () => {
//         console.log('Socket disconnected ' + socket.id);
//     });
//
//     socket.on('handshake', (handshakeData) => {
//         const {room, playerId} = handshakeData;
//
//         socket.join(room);
//
//         // someone joined, update others
//         const result = {error: undefined, data: undefined};
//         result.data = gameManager.getGameUpdate(room);
//         io.to(room).emit('gameUpdate', result);
//
//         socket.on('ready', () => {
//             const result = {error: undefined, data: undefined};
//
//             gameManager.ready(room, playerId);
//
//             // check if everyone is ready
//             if (gameManager.isEveryoneReady(room)) {
//                 gameManager.nextPlayer(room);
//                 const game = gameManager.getGame(room);
//                 game.started = true;
//                 // reset everyones ready state for UI reasons
//                 game.players.map(player => player.ready = false);
//             }
//
//             result.data = gameManager.getGameUpdate(room);
//
//             io.to(room).emit('gameUpdate', result);
//         });
//
//         socket.on('rollDice', () => {
//             try {
//                 let rolledDice = gameManager.rollDice(room, playerId);
//                 if (rolledDice) {
//                     io.to(room).emit('rolledDice', {data: rolledDice});
//                 } else {
//                     io.to(room).emit('lost', {playerId});
//                 }
//
//                 // send the reset delayed
//                 gameManager.nextPlayer(room).then(() => {
//                     const data = gameManager.getGameUpdate(room);
//                     io.to(room).emit('gameUpdate', {data});
//                 });
//
//                 const data = gameManager.getGameUpdate(room);
//                 io.to(room).emit('gameUpdate', {data});
//
//             } catch (err) {
//                 io.to(room).emit('gameError', err.message);
//             }
//         });
//
//         socket.on('loseLife', () => {
//             try {
//                 gameManager.loseLife(room, playerId);
//                 gameManager.nextPlayer(room);
//
//                 const data = gameManager.getGameUpdate(room);
//                 io.to(room).emit('gameUpdate', {data});
//             } catch (err) {
//                 io.to(room).emit('gameError', err.message);
//             }
//         });
//     });
// });

server.listen(port, () => {
    console.log(`Server listening on port[${port}]`);
});

