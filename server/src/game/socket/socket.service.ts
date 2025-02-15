import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Logger } from '../../utils/logger/logger.decorator';
import { LoggerService } from '../../utils/logger/logger.service';
import { Command } from '../Command';
import { GameUpdate } from '../Game';

import { GameService } from '../game.service';

@Injectable()
export class SocketService implements OnModuleDestroy {
    private _messages$ = new Subject<{
        room: string;
        eventName: string;
        data: any;
    }>();
    messages$ = this._messages$.asObservable();

    private unsubscribe$ = new Subject<void>();

    constructor(
        @Logger('SocketService') private logger: LoggerService,
        private readonly gameService: GameService
    ) {
        this.logger.log('constructed!');
    }

    onModuleDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
        this.logger.log('destroyed!');
    }

    emitToRoom(room: string, eventName: string, data?: unknown) {
        this._messages$.next({ room, eventName, data });
    }

    /**
     * Listen to game commands
     * @param room - The room key
     */
    subscribeToGame(room: string) {
        this.gameService
            .getGameCommand(room)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((command: Command) => {
                this.emitToRoom(room, command.eventName, command.data);
            });
    }

    /**
     * disconnected - When a players disconnects a property is set in the Player.
     * When he reconnects in the next {10000}ms the callback will be skipped, otherwise he will be kicked.
     * @param room - The room key
     * @param playerId - The players Id for this game
     */
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

    /**
     * When a client loads the game page, he sends a handshake event.
     * We connect the Client back to his Player if he was one.
     * @param room - The room key
     * @param playerId - The players Id for this game
     * @param [uid] - The clients UID
     * @returns GameUpdate data if the game was found, or undefined
     */
    async playerHandshake(
        room: string,
        playerId: string,
        uid?: string
    ): Promise<GameUpdate | undefined> {
        if (this.gameService.hasGame(room)) {
            if (this.gameService.isPlayerOfGame(room, playerId)) {
                await this.gameService.connect(room, playerId, uid);
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
