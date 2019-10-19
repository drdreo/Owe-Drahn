import 'reflect-metadata';

import * as http from 'http';
import * as cors from 'cors';
import * as session from 'express-session';
import * as bodyParser from 'body-parser';
import * as uuid from 'uuid';
import * as  express from 'express';

import { Container } from 'typedi';
import { EnvironmentService } from './environment.service';
import { GameService } from './game/game.service';
import { SocketService } from './socket.service';
import { GameErrorCode } from './game/GameError';
import { DBService } from './db.service';

const app = express();

const environmentService = Container.get<EnvironmentService>(EnvironmentService);
const gameService = Container.get<GameService>(GameService);
const socketService = Container.get<SocketService>(SocketService);
const dbService = Container.get<DBService>(DBService);

const whitelist = [
    'http://localhost:3000',
    'http://localhost:4000',
    'https://owe-drahn.herokuapp.com/',
    'http://owe-drahn.herokuapp.com/',
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
app.get('/api/join', (req: any, res: express.Response) => {
    const room = req.query.room;
    const username = req.query.username;
    const playerId = req.session.playerId ? req.session.playerId : uuid.v4();

    let error = undefined;

    if (room) {
        req.session.playerId = playerId;

        if (!gameService.hasGame(room)) {
            gameService.createGame(room);
            socketService.subscribeToGame(room);
        }

        if (gameService.hasGameStarted(room)) {
            error = {code: GameErrorCode.GAME_STARTED, message: `Game[${room}] has already started!`};
        } else {
            gameService.joinGame(room, playerId, username);
        }


        res.json({error, playerId});
    } else {
        res.status(500).send('No room code provided!');
    }
});

// Express Routers
app.get('/api/games/overview', (req: any, res: express.Response) => {

    const overview = gameService.getGamesOverview();
    res.json(overview);
});

app.post('/api/leave', (req: any, res: express.Response) => {
    const playerId = req.session.playerId ? req.session.playerId : req.body.playerId;

    let error = undefined;
    if (playerId) {

        const removed = gameService.removeIfPlayer(playerId);
        if (!removed) {
            error = {code: GameErrorCode.NO_PLAYER, message: 'Player is not part of ANY game!'};
        }

        res.json({error});
    } else {
        res.status(500).send('No playerId provided!');
    }
});

app.use(express.static(environmentService.frontendPath));

// general catch all
app.get(/^((?!\/api).)*$/, (req, res) => {
    console.log('serving: ' + environmentService.frontendPath + '/index.html');
    res.sendFile(environmentService.frontendPath + '/index.html');
});

const server = http.createServer(app);
socketService.connect(server);

server.listen(environmentService.port, () => {
    console.log(`Server listening on port[${environmentService.port}]`);
});

