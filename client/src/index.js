import { prod } from "./environment";

import React from "react";
import ReactDOM from "react-dom";

import { createStore, compose, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import { createBrowserHistory } from "history";
import { routerMiddleware } from "connected-react-router";

import Firebase, { FirebaseContext } from './auth/Firebase';

import "./index.css";
import App from "./App";

import * as serviceWorker from "./serviceWorker";
import connectSocket from "./socket/socket";

import { allReducers } from "./reducers";
import routingMiddleware from "./routing/routing.middleware";
import { settingsMiddleware } from "./settings/settings.middleware";
import analyticsMiddleware from "./analytics/analytics.middleware";

import { initGa } from "./analytics/ga";
import { feedMiddleware } from "./game/Feed/feed.middleware";

export const history = createBrowserHistory();

console.log("%cOwe Drahn", "font-size:40px; color:#7289da;");

const consoleAnimation = [
    "background-image: url(\"http://bestanimations.com/Games/Dice/rolling-dice-gif-7.gif\")",
    "background-size: cover",
    "padding: 30px 50px",
    "line-height: 50px"
].join(";");
console.log("%c ", consoleAnimation);
const consoleInformation = [
    "color: #7289da"
].join(";");
console.log("%cIf you want to contribute check out the repo https://github.com/drdreo/Owe-Drahn ", consoleInformation);

if (prod) {
    initGa(history);
}

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
    allReducers(history),
    {},
    composeEnhancer(
        applyMiddleware(
            routerMiddleware(history),
            routingMiddleware,
            settingsMiddleware,
            feedMiddleware,
            analyticsMiddleware
        )
    ));

// connect the socket to the store.
connectSocket(store);


ReactDOM.render(
    <Provider store={store}>
        <FirebaseContext.Provider value={new Firebase()}>
            <App />
        </FirebaseContext.Provider>
    </Provider>,
    document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

export default store;