import React from "react";
import ReactDOM from "react-dom";
import { createStore, compose, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import { createBrowserHistory } from "history";
import { routerMiddleware } from 'connected-react-router'

import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import connectSocket from "./socket/socket";

import { allReducers } from "./reducers";
import { routingMiddleware } from "./routing/routing.middleware";
import { settingsMiddleware } from "./settings/settings.middleware";

export const history = createBrowserHistory();

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
    allReducers(history),
    {},
    composeEnhancer(
        applyMiddleware(
            routerMiddleware(history),
            routingMiddleware,
            settingsMiddleware
        )
    ));

// connect the socket to the store.
connectSocket(store);


ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
