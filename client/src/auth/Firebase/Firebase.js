import app from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/analytics";

const config = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

class Firebase {
    constructor() {
        app.initializeApp(config);
        app.analytics();

        /* Firebase APIs */

        this.auth = app.auth();
        this.firestore = app.firestore();

        /* Social Sign In Method Provider */

        this.googleProvider = new app.auth.GoogleAuthProvider();
    }

    // *** Auth API ***

    doSignInWithGoogle = () => this.auth.signInWithPopup(this.googleProvider);

    doSignOut = () => this.auth.signOut();

    // *** Merge Auth and DB User API *** //

    onAuthUserListener = (next, fallback) => {
        this.auth.onAuthStateChanged(authUser => {
            if (authUser) {
                this.user(authUser.uid)
                    .get()
                    .then(doc => {
                        let dbUser = undefined;
                        if (doc.exists) {
                            dbUser = doc.data();

                            // default empty roles
                            if (!dbUser.roles) {
                                dbUser.roles = [];
                            }
                        } else {
                            // doc.data() will be undefined in this case
                            console.log(`No such user[${authUser.uid}] found!`);
                        }

                        // merge auth and db user
                        authUser = {
                            uid: authUser.uid,
                            email: authUser.email,
                            emailVerified: authUser.emailVerified,
                            providerData: authUser.providerData,
                            ...dbUser
                        };

                        next(authUser);
                    });
            } else {
                fallback();
            }
        });
    };

    onUserListener = (uid, cb) => {
        this.user(uid).onSnapshot(doc => {
            cb(doc.data());
        });
    };

    // *** User API ***

    user = uid => this.firestore.collection("users").doc(uid);

    users = () => this.firestore.collection("users");

    // *** Message API ***

    // message = uid => this.firestore.ref(`messages/${uid}`);

    // messages = () => this.firestore.ref('messages');
}

export default Firebase;
