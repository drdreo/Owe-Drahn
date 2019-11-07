import { Controller, Get, Param } from "@nestjs/common";

import { FormattedGame } from '../game/Game';
import { extractPlayerGames } from '../game/game.utils';

import { DBService } from '../db.service';

@Controller("api/users")
export class UserController {

    constructor(private readonly dbService: DBService) { }

    @Get(":uid")
    getOne(@Param("uid") uid: string) {
        return new Promise(resolve => {
            this.dbService.getAllGames().then(gamesSnapshot => {
                const allGames: FormattedGame[] = gamesSnapshot.docs.map(doc => doc.data() as FormattedGame);

                resolve(extractPlayerGames(uid, allGames));
            });
        })

    }
}