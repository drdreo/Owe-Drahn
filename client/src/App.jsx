import React, {Component} from "react";
import {Route, Switch} from "react-router-dom";
import {ConnectedRouter} from "connected-react-router";

import withAuthentication from "./auth/Session/withAuthentication";

import {history} from "./index";

import Home from "./home/Home";
import Game from "./game/Game";

import "./App.scss";

class App extends Component {
    render() {
        return (
            <ConnectedRouter history={history}>
                <Switch>
                    <Route path="/" exact component={Home}/>
                    <Route path="/game/:room" component={Game}/>
                </Switch>
            </ConnectedRouter>
        );
    }

}

export default withAuthentication(App);
