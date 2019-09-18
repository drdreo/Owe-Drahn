// import { Container } from 'typedi';
// import { SocketService } from '../socket.service';
// import { GameService } from '../game/game.service';
//
// const express = require('express');
// const uuidv4 = require('uuid/v4');
//
// const router = express.Router();
//
// let gameService = Container.get<GameService>(GameService);
// let socketService = Container.get<SocketService>(SocketService);
//
// // router.get('/', (req, res, next) => {
// //     if (!req.session.playerId) {
// //         req.session.playerId = uuidv4();
// //     }
// //     next();
// //     // res.sendFile(path.resolve(__dirname + '/../client/build/index.html'));
// // });
//
// router.get('/api/join', (req, res) => {
//     const room = req.query.room;
//     const username = req.query.username;
//     const playerId = req.session.playerId ? req.session.playerId : uuidv4();
//
//     if (room) {
//         req.session.playerId = playerId;
//
//         if (!gameService.hasGame(room)) {
//             gameService.createGame(room);
//             socketService.subscribeToGame(room);
//         }
//
//         gameService.joinGame(room, playerId, username);
//
//         res.json({error: undefined, playerId});
//     } else {
//         res.status(500).send('No room code provided!');
//     }
//
// });
//
//
// module.exports = router;
