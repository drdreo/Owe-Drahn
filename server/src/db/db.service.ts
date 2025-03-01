import { SentryTraced } from '@sentry/nestjs';
import * as admin from 'firebase-admin';
import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { FormattedGame, Game } from '../game/Game';
import { Environment, EnvironmentService } from '../environment.service';
import {
    defaultStats,
    extractPlayerStats,
    mergeStats,
    PlayerStats
} from '../game/game.utils';
import * as fs from 'node:fs';

export interface FirestoreDate {
    _seconds: number;
    _nanoseconds: number;
}

@Injectable()
export class DBService implements OnApplicationBootstrap {
    firestore: FirebaseFirestore.Firestore;
    private logger = new Logger(DBService.name);

    constructor(private environmentService: EnvironmentService) {
        this.logger.log('DBService - Constructed!');
    }

    onApplicationBootstrap() {
        let serviceAccount: string | admin.ServiceAccount;
        if (this.environmentService.env === Environment.production) {
            serviceAccount = JSON.parse(process.env.GCS_CREDENTIALS);
        } else {
            serviceAccount = JSON.parse(
                fs.readFileSync(
                    this.environmentService.credentialsDir + '/tmp.json',
                    'utf-8'
                )
            );
        }
        this.logger.log('Google service account loaded');

        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });

        this.firestore = admin.firestore();
        this.logger.log('firestore initialized');
    }

    @SentryTraced('Store Game')
    storeGame(game: Game) {
        try {
            this.firestore.collection('games').add(game.format());

            const registeredPlayers = game.getRegisteredPlayers();
            for (const player of registeredPlayers) {
                this.updatePlayerStats(player.uid, game.format())
                    .then(() => {
                        this.logger.debug('Successfully updated player stats!');
                    })
                    .catch((err) => {
                        this.logger.error(
                            'Update player stats - transaction failure: ',
                            err
                        );
                    });
            }
        } catch (e) {
            this.logger.error(e.message);
        }
    }

    @SentryTraced('Get Player Statistics')
    async getPlayerStats(uid: string): Promise<PlayerStats | undefined> {
        const doc = await this.getUserSnapshot(uid);
        if (!doc.exists) {
            this.logger.error('No such user!');
            return;
        }

        const user = doc.data();
        return user.stats;
    }

    @SentryTraced('Update Player Statistics')
    updatePlayerStats(uid: string, game: FormattedGame) {
        const userRef = this.firestore.collection('users').doc(uid);
        // extract the stats before the transaction, because it can run multiple times
        const newStats = extractPlayerStats(uid, game);

        // In a transaction, add the new rating and update the aggregate totals
        return this.firestore.runTransaction((transaction) => {
            return transaction.get(userRef).then((doc) => {
                if (!doc.exists) {
                    throw new Error('User does not exist!');
                }

                let stats: PlayerStats = doc.data().stats || defaultStats;
                stats = mergeStats(stats, newStats);
                // Commit to Firestore
                transaction.set(userRef, { stats }, { merge: true });
            });
        });
    }

    getAllGames(): Promise<FirebaseFirestore.QuerySnapshot> {
        return this.firestore.collection('games').get();
    }

    getUserSnapshot(uid: string): Promise<FirebaseFirestore.DocumentSnapshot> {
        return this.firestore.collection('users').doc(uid).get();
    }

}
