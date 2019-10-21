import 'reflect-metadata';

import * as http from 'http';
import * as cors from 'cors';
import * as session from 'express-session';
import * as bodyParser from 'body-parser';
import * as  express from 'express';

import { Container } from 'typedi';
import { EnvironmentService } from './environment.service';
import { GameService } from './game/game.service';
import { SocketService } from './socket.service';
import { apiRouter } from './routes/api';

const app = express();

const environmentService = Container.get<EnvironmentService>(EnvironmentService);
const gameService = Container.get<GameService>(GameService);
const socketService = Container.get<SocketService>(SocketService);

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

app.use('/api', apiRouter);

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

