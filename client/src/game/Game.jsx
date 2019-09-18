import React, {Component} from "react";
import socketIOClient from "socket.io-client";

import Player from "./Player/Player";
import LifeLoseBtn from "./LifeLoseBtn/LifeLoseBtn";

import "./Game.scss";

const SERVER_URL = process.env.REACT_APP_DOMAIN;

class Game extends Component {
    constructor(props) {
        super(props);

        this.diceRef = React.createRef();

        this.state = {
            rolledDice: undefined,
            currentValue: 0,
            socket: socketIOClient(SERVER_URL),
            players: [],
            started: false,
            over: false
        };


        this.state.socket.on("gameUpdate", response => {
            this.setState({
                players: response.data.players,
                started: response.data.started,
                over: response.data.over,
                currentValue: response.data.currentValue
            });
        });

        this.state.socket.on("rolledDice", response => {
            if (response.error) {
                console.error(response.error);
            } else {
                this.animateDice(response.data);
            }
        });

        this.state.socket.on("gameError", error => {
            console.error(error);
        });

        this.state.socket.on("lost", (data) => {
            console.warn("PLAYER LOST: " + data.playerId);
        });
    }

    componentDidMount() {
        const {room} = this.props.match.params;
        this.state.socket.on("connect", () => this.handshake(room));
    }

    render() {
        const {rolledDice, currentValue, players, started, over} = this.state;
        console.log(this.state);

        let controlButton;
        if (started && !over) {
            const currentPlayerId = sessionStorage.getItem("playerId");
            const isWaiting = !players.find(player => player.id === currentPlayerId).isPlayersTurn;

            controlButton = (<div style={{display: "flex"}} className={`${isWaiting ? "waiting" : ""}`}>
                <button disabled={isWaiting} className="button" onClick={() => this.rollDice()}>Roll</button>
                <LifeLoseBtn disabled={isWaiting} onClick={() => this.loseLife()}></LifeLoseBtn>
            </div>);
        } else if (!over) {
            controlButton = <button className="button light" onClick={() => this.ready()}>Ready</button>;
        }

        return (
            <div className="page-container">
                <h5 className="heading">Game</h5>
                <div className="players-list">
                    {players.map((player, key) =>
                        <Player player={player} key={player.id}/>
                    )}
                </div>

                <div className="controls">
                    {controlButton}
                </div>
                <div className="statistics">
                    <div className="rolled-dice">{rolledDice}</div>
                    <div className="current-value">{currentValue}</div>
                </div>

                <div className="dice" ref={this.diceRef}></div>
            </div>
        );
    }

    handshake(room) {
        this.state.socket.emit("handshake", {playerId: sessionStorage.getItem("playerId"), room});
    }

    ready() {
        this.state.socket.emit("ready");
    }

    rollDice() {
        this.state.socket.emit("rollDice");
    }

    loseLife() {
        this.state.socket.emit("loseLife");
    }

    animateDice(value) {
        window.rollADie({
            element: this.diceRef.current,
            numberOfDice: 1,
            callback:  () => {
                console.log("done animating");
                this.setState({rolledDice: value});
            },
            values: [value]
        });
    }
}

export default Game;
