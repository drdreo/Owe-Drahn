import * as uuid from 'uuid';
import * as  express from 'express';

const router = express.Router();

import { GameErrorCode } from '../game/GameError';
import { Container } from 'typedi';
import { GameService } from '../game/game.service';
import { SocketService } from '../socket.service';
import { FormattedGame, DBService } from '../db.service';
import { extractPlayerGames } from '../game/utils';

const gameService = Container.get<GameService>(GameService);
const socketService = Container.get<SocketService>(SocketService);
const dbService = Container.get<DBService>(DBService);

// define the home page route
router.get('/join', (req: any, res: express.Response) => {
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
// define the about route
router.post('/leave', (req: any, res: express.Response) => {
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


router.get('/games/overview', (req: any, res: express.Response) => {
    const overview = gameService.getGamesOverview();
    res.json(overview);
});

router.get('/user/:uid/games', async (req: any, res: express.Response) => {
    const uid = req.params.uid;

    if (!uid) {
        throw new Error('Invalid user ID!');
    }
    const gamesSnapshot = await dbService.getAllGames();
    const allGames: FormattedGame[] = gamesSnapshot.docs.map(doc => doc.data() as FormattedGame);

    const playersGames = extractPlayerGames(uid, allGames);
    res.json(playersGames);
});


export const apiRouter = router;
