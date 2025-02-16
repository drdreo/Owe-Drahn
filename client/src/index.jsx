import {createRoot} from 'react-dom/client';
import {Provider} from "react-redux";
import {createBrowserHistory} from "history";
import {applyMiddleware} from '@reduxjs/toolkit';
import { legacy_createStore as createStore} from 'redux'
import {BrowserRouter} from "react-router-dom";

import {FirebaseProvider} from './auth/Firebase';

import "./index.css";
import App from "./App.jsx";

import * as serviceWorker from "./serviceWorker";
import connectSocket from "./socket/socket";
import {createRootReducer} from "./reducers";
import {settingsMiddleware} from "./settings/settings.middleware";
import {feedMiddleware} from "./game/Feed/feed.middleware";

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
