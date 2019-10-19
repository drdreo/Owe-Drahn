import { Firestore } from '@google-cloud/firestore';


import { Service } from 'typedi';
import { Game } from './game/Game';

@Service()
export class DBService {

    private firestore = new Firestore();

    constructor() {

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
            this.firestore.collection('games').add({players: game.getFormattedPlayers(), rolls: game.getRolls()});
        } catch (e) {
            console.error(e.message);
        }
    }
}
