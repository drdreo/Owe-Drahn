# Owe-Drahn
A pure luck based gambling game.

<img src="http://bestanimations.com/Games/Dice/rolling-dice-gif-7.gif" width="200">


Built with React & node.js by DrDreo as a learning experience for React.

## Init
Make sure to have the latest Node and npm installed then run `npm i` in the root and the client folder.

### Database
Additionally, you need to create a [firebase project](https://firebase.google.com
) to be able to connect to the database. You will receive the config as JSON like:
```js
var firebaseConfig = {
  apiKey: "api-key",
  authDomain: "project-id.firebaseapp.com",
  databaseURL: "https://project-id.firebaseio.com",
  projectId: "project-id",
  storageBucket: "project-id.appspot.com",
  messagingSenderId: "sender-id",
  appId: "app-id",
  measurementId: "G-measurement-id",
};
```
During local development, this config needs to be stored inside [root/credentials/](https://github.com/drdreo/Owe-Drahn/blob/1a0a7c6d23346f05f7e0ada03cf6bab8d2bc868f/db.service.ts#L17).

In production, you need to have the environment variable `GCS_CREDENTIALS` set to the exact same JSON data.

## Running
1. Start the server: `npm run dev`
2. Start the client: `cd client && npm start`
