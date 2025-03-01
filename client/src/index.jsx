import {applyMiddleware} from '@reduxjs/toolkit';
import * as Sentry from "@sentry/react";
import {createBrowserHistory} from "history";
import {createRoot} from 'react-dom/client';
import {Provider} from "react-redux";
import {BrowserRouter} from "react-router-dom";
import {legacy_createStore as createStore} from 'redux'

import App from "./App.jsx";
import {FirebaseProvider} from './auth/Firebase';
import {feedMiddleware} from "./game/Feed/feed.middleware";
import {createRootReducer} from "./reducers";
import * as serviceWorker from "./serviceWorker";
import {settingsMiddleware} from "./settings/settings.middleware";
import connectSocket from "./socket/socket";

import "./index.css";

Sentry.init({
    dsn: "https://7161d3e0e54e220191f43c781ff002a8@o528779.ingest.us.sentry.io/4508902126452736",
    integrations: [],
});

export const history = createBrowserHistory();

const store = createStore(
    createRootReducer(history),
    {}, (
        applyMiddleware(
            settingsMiddleware,
            feedMiddleware
        )
    ));

// connect the socket to the store.
connectSocket(store);

const root = createRoot(document.getElementById('root'));
root.render(
    <Provider store={store}>
        <BrowserRouter>
            <FirebaseProvider>
                <App/>
            </FirebaseProvider>
        </BrowserRouter>
    </Provider>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

export default store;
