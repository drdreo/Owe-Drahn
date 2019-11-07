import * as admin from 'firebase-admin';
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { FormattedGame, Game } from './game/Game';
import { Environment, EnvironmentService } from './environment.service';
import { defaultStats, extractPlayerStats, mergeStats, PlayerStats } from './game/game.utils';
import { Logger } from './utils/logger/logger.decorator';
import { LoggerService } from './utils/logger/logger.service';

export interface FirestoreDate {
    _seconds: number;
    _nanoseconds: number;
}

export interface User {
    stats: PlayerStats;
    username: string;
    email: string;
    uid: string;
}

@Injectable()
export class DBService implements OnApplicationBootstrap {

    firestore: FirebaseFirestore.Firestore;

    constructor(@Logger('DBService') private logger: LoggerService, private environmentService: EnvironmentService) {
        this.logger.log("DBService - Constructed!");
    }

    onApplicationBootstrap() {
        let serviceAccount = '';
        if (this.environmentService.env === Environment.production) {
            serviceAccount = JSON.parse(process.env.GCS_CREDENTIALS);
        } else {
            // serviceAccount = require('./credentials/owe-drahn-b01e77bcc3a4.json');
            serviceAccount = require('../../credentials/owe-drahn-95b28ef424c4.json');
        }
        this.logger.log("Google service acount loaded");



        if (admin.apps.length === 0) {
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
            });
        }
        this.firestore = admin.firestore();
        this.logger.log("firestore initialized");
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

                let stats: PlayerStats = doc.data().stats || defaultStats;
                stats = mergeStats(stats, newStats);
                // Commit to Firestore
                transaction.set(userRef, { stats }, { merge: true });
            });
        });
    }

    getAllGames(): Promise<FirebaseFirestore.QuerySnapshot> {
        return this.firestore.collection('games')
            .get();

    }

    getUserSnapshot(uid: string): Promise<FirebaseFirestore.DocumentSnapshot> {
        return this.firestore.collection('users').doc(uid).get();
    }

    async getPlayersRank(uid: string): Promise<number> {
        const doc = await this.getUserSnapshot(uid);

        if (!doc.exists) {
            console.error('No such user!');
            return 0;
        } else {
            const user = doc.data() as User;
            return Math.floor(user.stats.totalGames / 10) + user.stats.totalGames;
        }

    }
}
