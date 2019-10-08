import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import axios from "axios";

import "./Home.scss";
import {gameReset} from "../game/game.actions";
import {connect} from "react-redux";
import {redirectToGame} from "../routing/routing.actions";

console.log(process.env);
const API_URL = process.env.REACT_APP_API_URL;

class Home extends Component {
    constructor(props) {
        super(props);
        console.log("HOME constructed!");

        this.state = {
            room: "",
            username: ""
        };

        const wasPlayer = !!sessionStorage.getItem("playerId");
        if (wasPlayer) {
            // Probably redundant since socket sends leave when it was in a game
            this.leaveGame();
        }
        // TODO: check why this is not always called
        this.props.resetGameState();
    }

    componentDidMount(){
        console.log("HOME mounted");
    }

    render() {
        return (
            <div className="page-container">
                <h4>Owe Drahn</h4>
                <div className="form">
                    <input className="input username" value={this.state.username}
                           onChange={evt => this.updateUsername(evt)}
                           placeholder="Username"/>
                    <input className="input room" value={this.state.room}
                           onChange={evt => this.updateRoom(evt)}
                           placeholder="Room"/>
                    <button className="button join" onClick={() => this.joinGame()}>Join</button>
                </div>
            </div>
        );
    }

    updateRoom(evt) {
        this.setState({
            room: evt.target.value
        });
    }

    updateUsername(evt) {
        this.setState({
            username: evt.target.value
        });
    }

    joinGame() {
        const room = encodeURIComponent(this.state.room);
        const username = this.state.username;

        axios.get(`${API_URL}/join?room=${room}&username=${username}`, {withCredentials: true})
            .then((response) => {
                console.log(response);
                if (response.data.error) {
                    // TODO: show error
                    console.log(response.data.error);
                } else {
                    sessionStorage.setItem("playerId", response.data.playerId);
                    this.props.redirectToGame(room);
                }

            });
    }

    leaveGame() {
        const playerId = sessionStorage.getItem("playerId");

        axios.post(`${API_URL}/leave`, {playerId}, {withCredentials: true})
            .then((response) => {
                console.log(response);
                sessionStorage.removeItem("playerId");
            });
    }
}

const mapDispatchToProps = dispatch => {
    return {
        resetGameState: () => dispatch(gameReset()),
        redirectToGame: (room) => dispatch(redirectToGame(room))
    };
};
export default connect(null, mapDispatchToProps)(withRouter(Home));

