import * as admin from 'firebase-admin';
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { FormattedGame, Game } from '../game/Game';
import { Environment, EnvironmentService } from '../environment.service';
import { defaultStats, extractPlayerStats, mergeStats, PlayerStats } from '../game/game.utils';
import { Logger } from '../utils/logger/logger.decorator';
import { LoggerService } from '../utils/logger/logger.service';

import { User } from './User';

export interface FirestoreDate {
    _seconds: number;
    _nanoseconds: number;
}

@Injectable()
export class DBService implements OnApplicationBootstrap {

    firestore: FirebaseFirestore.Firestore;

    constructor(@Logger('DBService') private logger: LoggerService, private environmentService: EnvironmentService) {
        this.logger.log('DBService - Constructed!');
    }

    onApplicationBootstrap() {
        let serviceAccount = '';
        if (this.environmentService.env === Environment.production) {
            serviceAccount = JSON.parse(process.env.GCS_CREDENTIALS);
        } else {
            serviceAccount = require('../../../credentials/owe-drahn-b01e77bcc3a4.json');
            // serviceAccount = require('../../../credentials/owe-drahn-95b28ef424c4.json');
        }
        this.logger.log('Google service account loaded');

        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });

        this.firestore = admin.firestore();
        this.logger.log('firestore initialized');
    }

    storeGame(game: Game) {
        try {
            this.firestore.collection('games').add(game.format());

            const registeredPlayers = game.getRegisteredPlayers();
            for (let player of registeredPlayers) {
                this.updatePlayerStats(player.uid, game.format())
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
                transaction.set(userRef, {stats}, {merge: true});
            });
        });
    }

    getAllGames(): Promise<FirebaseFirestore.QuerySnapshot> {
        return this.firestore.collection('games').get();
    }

    getUserSnapshot(uid: string): Promise<FirebaseFirestore.DocumentSnapshot> {
        return this.firestore.collection('users').doc(uid).get();
    }

    async getPlayersRank(uid: string): Promise<number> {
        const doc = await this.getUserSnapshot(uid);

        if (!doc.exists) {
            this.logger.error('No such user!');
            return 0;
        } else {
            const user = doc.data() as User;
            return Math.floor(user.stats.totalGames / 10) + user.stats.totalGames;
        }
    }
}
