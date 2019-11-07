import { Injectable } from '@nestjs/common';

import { GameService } from '../game.service';
import { Command } from '../Command';
import { LoggerService } from '../../utils/logger/logger.service';
import { Logger } from '../../utils/logger/logger.decorator';

@Injectable() export class SocketService {


    constructor(@Logger('SocketService') private logger: LoggerService, private readonly gameService: GameService) {
        this.logger.log("Constructed!")
    }

    // send too all clients in room
    emitToRoom(room: string, eventName: string, data?: unknown) {
    }

    disconnected(room: string, playerId: string) {
        this.gameService.disconnect(room, playerId);
        // remove player if he doesn't reconnect
        setTimeout(() => {
            if (!this.gameService.isConnected(room, playerId)) {
                this.gameService.leave(room, playerId);
            } else {
                this.logger.log(`Disconnected player[${playerId}] reconnected`);
            }
        }, 10000);
    }


    subscribeToGame(room: string): void {
        this.gameService.getGameCommand(room)
            .subscribe((command: Command) => {
                this.emitToRoom(room, command.eventName, command.data);
            });
    }

}
