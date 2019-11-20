import * as admin from 'firebase-admin';
import { defaultStats, extractPlayerStats, mergeStats } from './src/game/game.utils';
import { FormattedGame, Game } from './src/game/Game';

const fs = require('fs');

const serviceAccount = require('../credentials/owe-drahn-b01e77bcc3a4.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const firestore = admin.firestore();

console.log('Firestore initialized');


const felix = '6znhWxKuQhN4P0IcvVuKq7ppyVa2',
    flo = 'OSK2V0QRcaSrIhGMcnnqxmujrJK2',
    peda = 'mmttEegNqNf10ouitIhnJCYvaeV2';

(async function main() {
        const gamesSnapshot = await getAllGames();
        const allGames = gamesSnapshot.docs.map(doc => {
            return {id: doc.id, data: doc.data() as FormattedGame};
        });

        // @ts-ignore
        const games = allGames.filter(game => game.data.startedAt && game.data.startedAt._seconds * 1000 > 1573344000 && game.data.startedAt._seconds * 1000 < new Date().getTime());

        // fs.writeFileSync('games.json', JSON.stringify(games));
        // reset players
        const pedaRef = firestore.collection('users').doc(peda);
        const lixRef = firestore.collection('users').doc(felix);
        const floRef = firestore.collection('users').doc(flo);
        let pedaStats = defaultStats;
        let lixStats = defaultStats;
        let floStats = defaultStats;
        // await pedaRef.update({stats: pedaStats});
        // await lixRef.update({stats: lixStats});
        // await floRef.update({stats: floStats});


        for (let game of games) {
            // patch all players
            // for (let player of game.data.players) {
            //     if (player.username === 'Peda Power' || player.username === 'Peter Power') {
            //         player.uid = peda;
            //         console.log('updating peda');
            //     } else if (player.username === 'fleixn' && !player.uid) {
            //         player.uid = felix;
            //     } else if (player.username === 'Flofi' && !player.uid) {
            //         player.uid = flo;
            //     }
            // }

            // patch all rolls
            // for (let roll of game.data.rolls) {
            //     if (roll.player.username === 'Peda Power' && !roll.player.uid) {
            //         roll.player.uid = peda;
            //         console.log('updating peda');
            //     } else if (roll.player.username === 'fleixn' && !roll.player.uid) {
            //         roll.player.uid = felix;
            //     } else if (roll.player.username === 'Flofi' && !roll.player.uid) {
            //         roll.player.uid = flo;
            //     }
            // }

            // patch all player stats
            const registeredPlayers = game.data.players.filter(player => player.uid);

            for (let player of registeredPlayers) {
                if (player.uid === peda) {
                    const newStats = extractPlayerStats(player.uid, game.data);
                    // @ts-ignore
                    pedaStats = mergeStats(pedaStats, newStats);
                    // @ts-ignore
                    pedaStats.id = player.uid;
                }
            }

            // let gameRef = firestore.collection('games').doc(game.id);
            // // // gameRef.update({rolls: game.data.rolls});
            // gameRef.update({players: game.data.players});
            // console.log('patching game');


        }
        console.log({pedaStats});
        // console.log({pedaStats});
        // console.log({floStats});
        await pedaRef.update({stats: pedaStats});

    }
)();

function updateStats(uid, stats) {
    const playerRef = firestore.collection('users').doc(uid);
    return playerRef.set({stats}, {merge: true});
}

function getAllGames(): Promise<FirebaseFirestore.QuerySnapshot> {
    return firestore.collection('games').get();
}

function getAllPlayerGames(uid: string) {
    return firestore.collection('games');
}

function storeGame(game: Game) {
    try {
        // game needs: {
        //             startedAt: this.startedAt,
        //             finishedAt: this.finishedAt,
        //             players: this.getFormattedPlayers(),
        //             rolls: this.getRolls(),
        //}
        const formattedGame = game.format();
        const registeredPlayers = game.getRegisteredPlayers();

        firestore.collection('games').add(formattedGame);

        for (let player of registeredPlayers) {
            this.updatePlayerStats(player.uid, formattedGame)
                .then(() => {
                    this.logger.debug('Successfully updated player stats!');
                })
                .catch(err => {
                    this.logger.error('Update player stats - transaction failure: ', err);
                });
        }
    } catch (e) {
        this.logger.error(e.message);
    }
}


function updatePlayerStats(uid: string, game: FormattedGame) {
    const userRef = firestore.collection('users').doc(uid);
    // extract the stats before the transaction, because it can run multiple times
    const newStats = extractPlayerStats(uid, game);

    // In a transaction, add the new rating and update the aggregate totals
    return firestore.runTransaction(transaction => {
        return transaction.get(userRef).then(doc => {
            if (!doc.exists) {
                throw 'User does not exist!';
            }

            let stats = doc.data().stats || defaultStats;
            stats = mergeStats(stats, newStats);
            // Commit to Firestore
            transaction.set(userRef, {stats}, {merge: true});
        });
    });
}
