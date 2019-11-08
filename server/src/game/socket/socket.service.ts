import { Injectable, OnModuleDestroy } from '@nestjs/common';

import { GameService } from '../game.service';
import { Command } from '../Command';
import { LoggerService } from '../../utils/logger/logger.service';
import { Logger } from '../../utils/logger/logger.decorator';
import { Subject } from 'rxjs';

@Injectable() export class SocketService implements OnModuleDestroy {

    private _messsages$ = new Subject();
    messsages$ = this._messsages$.asObservable();

    private unsubscribe$ = new Subject();

    constructor(@Logger('SocketService') private logger: LoggerService, private readonly gameService: GameService) {
        this.logger.log("Constructed!")
    }

    onModuleDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    emitToRoom(room: string, eventName: string, data?: unknown) {
        this._messsages$.next({ room, eventName, data });
    }

    subscribeToGame(room: string): void {
        this.gameService.getGameCommand(room)
            .subscribe((command: Command) => {
                this.emitToRoom(room, command.eventName, command.data);
            });
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

    leave(room: string, playerId: string): boolean {
        return this.gameService.leave(room, playerId);
    }

    playerHandshake(room: string, playerId: string, uid: string): object | undefined {
        if (this.gameService.hasGame(room)) {
            if (this.gameService.isPlayerOfGame(room, playerId)) {
                this.gameService.connect(room, playerId, uid);
            }
            return this.gameService.getGameUpdate(room);
        }
        return;
    }

    ready(room: string, playerId: string, ready: boolean) {
        this.gameService.ready(room, playerId, ready);
    }

    rollDice(room: string, playerId: string) {
        this.gameService.rollDice(room, playerId);
    }

    loseLife(room: string, playerId: string) {
        this.gameService.loseLife(room, playerId);
    }

    chooseNextPlayer(room: string, playerId: string, nextPlayerId: string) {
        this.gameService.chooseNextPlayer(room, playerId, nextPlayerId);
    }

}
