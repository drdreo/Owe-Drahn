import React, { Component } from "react";
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Home from './home/Home';
import Game from './Game/Game';


class App extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <Router>
        <Route path="/" exact component={Home} />
        <Route path="/game/:room" component={Game} />
      </Router>
    );
  }

}

export default App;