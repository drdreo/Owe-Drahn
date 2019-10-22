import * as admin from 'firebase-admin';
import { Service } from 'typedi';
import { FormattedGame, Game } from './game/Game';
import { Environment, EnvironmentService } from './environment.service';
import { defaultStats, extractPlayerStats, PlayerStats } from './game/utils';

export interface FirestoreDate {
    _seconds: number;
    _nanoseconds: number;
}

@Service()
export class DBService {

    firestore: FirebaseFirestore.Firestore;

    constructor(private environmentService: EnvironmentService) {
        let serviceAccount = '';
        if (environmentService.env === Environment.production) {
            serviceAccount = JSON.parse(process.env.GCS_CREDENTIALS);
        } else {
            serviceAccount = require('./credentials/owe-drahn-b01e77bcc3a4.json');
        }

        console.log(serviceAccount);

        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });

        this.firestore = admin.firestore();
    }


    async quickstart() {
        // Obtain a document reference.
        const document = this.firestore.doc('posts/intro-to-firestore');

        // Enter new data into the document.
        await document.set({
            title: 'Welcome to Firestore',
            body: 'Hello World',
        });
        console.log('Entered new data into the document');

        // Update an existing document.
        await document.update({
            body: 'My first Firestore app',
        });
        console.log('Updated an existing document');

        // Read the document.
        let doc = await document.get();
        console.log('Read the document', doc);


    }

    storeGame(game: Game) {
        try {
            this.firestore.collection('games')
                .add(game.format());

            const registeredPlayers = game.getRegisteredPlayers();
            for (let player of registeredPlayers) {
                this.updatePlayerStats(player.uid, game.format())
                    .then(result => {
                        // console.log('Successfully updated player stats!', result);
                    })
                    .catch(err => {
                        console.error('Update player stats - transaction failure: ', err);
                    });
            }

        } catch (e) {
            console.error(e.message);
        }
    }

    updatePlayerStats(uid: string, game: FormattedGame) {
        const userRef = this.firestore.collection('users').doc(uid);
        // extract the stats before the transaction, because it can run multiple times
        const newStats = extractPlayerStats(uid, game);

        // In a transaction, add the new rating and update the aggregate totals
        return this.firestore.runTransaction(transaction => {
            return transaction.get(userRef).then(doc => {
                if (!doc.exists) {
                    throw 'User does not exist!';
                }

                const stats: PlayerStats = doc.data().stats || defaultStats;

                stats.perfectRoll += newStats.perfectRoll;
                stats.luckiestRoll += newStats.luckiestRoll;
                stats.worstRoll += newStats.perfectRoll;
                stats.rolled21 += newStats.rolled21;
                stats.maxLifeLoss += newStats.maxLifeLoss;
                stats.wins = newStats.won ? stats.wins + 1 : stats.wins;
                stats.totalGames++;
                for (let i = 0; i < 6; i++) {
                    stats.rolledDice[i] += newStats.rolledDice[i];
                }
                // Commit to Firestore
                transaction.set(userRef, {stats}, {merge: true});
            });
        });
    }

    getAllGames(): Promise<FirebaseFirestore.QuerySnapshot> {
        return this.firestore.collection('games')
                   .get();

    }
}
