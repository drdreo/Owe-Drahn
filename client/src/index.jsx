import {prod} from "./environment";

import {createRoot} from 'react-dom/client';
import {Provider} from "react-redux";
import {createBrowserHistory} from "history";
import {applyMiddleware, createStore} from '@reduxjs/toolkit';

import {FirebaseProvider} from './auth/Firebase';

import "./index.css";
import App from "./App.jsx";

import * as serviceWorker from "./serviceWorker";
import connectSocket from "./socket/socket";

import {allReducers} from "./reducers";
import {settingsMiddleware} from "./settings/settings.middleware";
import analyticsMiddleware from "./analytics/analytics.middleware";

import {initGa} from "./analytics/ga";
import {feedMiddleware} from "./game/Feed/feed.middleware";
import {BrowserRouter} from "react-router-dom";

export const history = createBrowserHistory();


if (prod) {
    initGa(history);
}


const store = createStore(
    allReducers(history),
    {}, (
        applyMiddleware(
            settingsMiddleware,
            feedMiddleware,
            analyticsMiddleware
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
