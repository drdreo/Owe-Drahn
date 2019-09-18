import React, {Component} from "react";
import {BrowserRouter as Router, Route} from "react-router-dom";
import Home from "./home/Home";
import Game from "./game/Game";

import "./App.scss";

class App extends Component {
    render() {
        return (
            <Router>
                <Route path="/" exact component={Home}/>
                <Route path="/game/:room" component={Game}/>
            </Router>
        );
    }

}

export default App;
