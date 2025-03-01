import {
    Controller,
    Req,
    Query,
    Get,
    Post,
    BadRequestException
} from '@nestjs/common';

import * as uuid from 'uuid';

import { GameService, GamesOverview } from './game.service';
import { SocketService } from './socket/socket.service';
import { GameErrorCode } from './GameError';

@Controller('/api')
export class GameController {
    constructor(
        private readonly gameService: GameService,
        private readonly socketService: SocketService
    ) {}

    @Get('join')
    joinGame(
        @Req() req,
        @Query('room') room: string,
        @Query('username') username: string
    ) {
        if (!room) {
            throw new BadRequestException({
                message: 'Missing "room" parameter!'
            });
        }
        if (!username) {
            throw new BadRequestException({
                message: 'Missing "username" parameter!'
            });
        }

        const playerId = req.session.playerId
            ? req.session.playerId
            : uuid.v4();

        let error = undefined;

        req.session.playerId = playerId;

        if (!this.gameService.hasGame(room)) {
            this.gameService.createGame(room);
            this.socketService.subscribeToGame(room);
        }

        if (this.gameService.hasGameStarted(room)) {
            error = {
                code: GameErrorCode.GAME_STARTED,
                message: `Game[${room}] has already started!`
            };
        } else {
            this.gameService.joinGame(room, playerId, username);
        }

        if (!error) {
            this.socketService.sendGameOverview();
        }
        return { error, playerId };
    }

    @Post('leave')
    leaveGame(@Req() req) {
        const playerId = req.session.playerId
            ? req.session.playerId
            : req.body.playerId;

        if (!playerId) {
            throw new BadRequestException({
                message: 'Missing "playerId" parameter!'
            });
        }

        let error = undefined;
        const removed = this.gameService.removeIfPlayer(playerId);
        if (!removed) {
            error = {
                code: GameErrorCode.NO_PLAYER,
                message: 'Player is not part of ANY game!'
            };
        }

        return error;
    }

    @Get('games/overview')
    getGamesOverview(): GamesOverview {
        return this.gameService.getGamesOverview();
    }
}
