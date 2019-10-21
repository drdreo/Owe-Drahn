import { Game } from './Game';
import { DBGame } from '../db.service';

export interface PlayerStats {
    rolledDice: number[];
    wins: number;
    totalGames: number;
    perfectRoll: number; // rolling from 9 to 15
    luckiestRoll: number; // rolling 3 at 15
    worstRoll: number; // Rolling a 6 at 10
    rolled21: number; // rolling 6 at 15
    maxLifeLoss: number; // losing with 6 life left
}

export const defaultStats: PlayerStats = {
    rolledDice: [0, 0, 0, 0, 0, 0],
    wins: 0,
    totalGames: 0,
    perfectRoll: 0,
    luckiestRoll: 0,
    worstRoll: 0,
    rolled21: 0,
    maxLifeLoss: 0,
};

export function extractPlayerStats(uid: string, game: Game) {
    const aggregation = {
        rolledDice: [0, 0, 0, 0, 0, 0],
        won: false,
        perfectRoll: 0,
        luckiestRoll: 0,
        worstRoll: 0,
        rolled21: 0,
        maxLifeLoss: 0,
    };

    // aggregate all player rolls
    const playerRolls = game.getRolls().reduce((total, cur) => {
        if (cur.player.uid === uid) {
            total.push(cur);
        }
        return total;
    }, []);

    // calculate if player won
    aggregation.won = game.getPlayers().some(player => player.uid === uid && player.life > 0);

    // extract statistics of rolled dice
    for (const roll of playerRolls) {
        aggregation.rolledDice[roll.dice - 1]++;

        // Perfect roll
        if (roll.dice === 6 && roll.total === 15) {
            aggregation.perfectRoll++;
        }
        // luckiestRoll
        if (roll.dice === 3 && roll.total === 15) {
            aggregation.luckiestRoll++;
        }
        // worst roll
        if (roll.dice === 6 && roll.total === 16) {
            aggregation.worstRoll++;
        }
        // rolled 21
        if (roll.total === 21) {
            aggregation.rolled21++;
        }

        // lost at max life
        if (roll.player.life === 6 && roll.total > 15) {
            aggregation.maxLifeLoss++;
        }
    }

    return aggregation;
}


export function extractPlayerGames(uid: string, games: DBGame[]) {
    return games.filter(game =>
        game.players.some(player => player.uid === uid),
    );
}

export function extractPlayerRollsOfGames(uid: string, games: Game[]) {
    const playerRolls = [];
    for (let game of games) {
        // aggregate all own rolls
        playerRolls.push(
            ...game.getRolls().reduce((total, cur) => {
                if (cur.player.uid === uid) {
                    total.push(cur);
                }
                return total;
            }, []),
        );

    }
    return playerRolls;
}


