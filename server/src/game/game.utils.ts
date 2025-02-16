import { FormattedGame, Game } from './Game';

export interface PlayerStats {
    rolledDice: number[]; // amount of times rolled 1-6
    wins: number;
    totalGames: number;
    perfectRoll: number; // rolling from 9 to 15
    luckiestRoll: number; // rolling 3 at 15
    worstRoll: number; // rolling a 6 at 10
    rolled21: number; // rolling 6 at 15
    maxLifeLoss: number; // losing with 6 life left
}

export type PlayerStatAggregation = Omit<PlayerStats, 'wins' | 'totalGames'> & {
    won: boolean;
};

export const defaultStats: PlayerStats = {
    rolledDice: [0, 0, 0, 0, 0, 0],
    wins: 0,
    totalGames: 0,
    perfectRoll: 0,
    luckiestRoll: 0,
    worstRoll: 0,
    rolled21: 0,
    maxLifeLoss: 0
};

export function extractPlayerStats(
    uid: string,
    game: FormattedGame
): PlayerStatAggregation {
    console.log('extracting: ' + uid);
    const aggregation: PlayerStatAggregation = {
        rolledDice: [0, 0, 0, 0, 0, 0],
        won: false,
        perfectRoll: 0,
        luckiestRoll: 0,
        worstRoll: 0,
        rolled21: 0,
        maxLifeLoss: 0
    };

    // aggregate all player rolls
    const playerRolls = game.rolls.filter((roll) => roll.player.uid === uid);

    // fail safe, if player didnt roll actually
    if (playerRolls.length === 0) {
        return aggregation;
    }

    // calculate if player won
    aggregation.won = game.players.some(
        (player) => player.uid === uid && player.life > 0
    );

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
    }

    // only have to check last roll of this players rolls, was the ending one
    const lastRoll = playerRolls[playerRolls.length - 1];
    // worst roll
    if (lastRoll.dice === 6 && lastRoll.total === 16) {
        aggregation.worstRoll++;
    }
    // rolled 21
    if (lastRoll.total === 21) {
        aggregation.rolled21++;
    }

    // lost at max life
    if (lastRoll.player.life === 6 && lastRoll.total > 15) {
        aggregation.maxLifeLoss++;
    }

    // console.log(aggregation);
    return aggregation;
}

export function extractPlayerGames(uid: string, games: FormattedGame[]) {
    return games.filter((game) =>
        game.players.some((player) => player.uid === uid)
    );
}

export function extractPlayerRollsOfGames(uid: string, games: Game[]) {
    const playerRolls = [];
    for (const game of games) {
        // aggregate all own rolls
        playerRolls.push(
            ...game.getRolls().reduce((total, cur) => {
                if (cur.player.uid === uid) {
                    total.push(cur);
                }
                return total;
            }, [])
        );
    }
    return playerRolls;
}

export function mergeStats(
    oldStats: PlayerStats,
    newStats: PlayerStatAggregation
): PlayerStats {
    const stats = { ...oldStats };
    stats.perfectRoll += newStats.perfectRoll;
    stats.luckiestRoll += newStats.luckiestRoll;
    stats.worstRoll += newStats.worstRoll;
    stats.rolled21 += newStats.rolled21;
    stats.maxLifeLoss += newStats.maxLifeLoss;
    stats.wins = newStats.won ? oldStats.wins + 1 : oldStats.wins;
    stats.totalGames++;
    for (let i = 0; i < 6; i++) {
        stats.rolledDice[i] += newStats.rolledDice[i];
    }

    return stats;
}
