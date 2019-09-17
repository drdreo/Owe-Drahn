import { gameManager } from '../game';

const path = require('path');
const express = require('express');
const uuidv4 = require('uuid/v4');

const router = express.Router();


router.get('/', (req, res, next) => {
    if (!req.session.playerId) {
        req.session.playerId = uuidv4();
    }
    next();
    // res.sendFile(path.resolve(__dirname + '/../client/build/index.html'));
});

router.get('/join', (req, res) => {
    const room = req.query.room;
    const username = req.query.username;
    const playerId = req.session.playerId ? req.session.playerId : uuidv4();

    if (room) {
        req.session.playerId = playerId;

        if (!gameManager.hasGame(room)) {
            gameManager.createGame(room);
        }

        gameManager.joinGame(room, playerId, username);

        res.json({error: undefined, playerId});
    } else {
        res.status(500).send('No room code provided!');
    }

});


module.exports = router;
