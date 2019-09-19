import React, {Component} from "react";
import socketIOClient from "socket.io-client";

import Player from "./Player/Player";
import LifeLoseBtn from "./LifeLoseBtn/LifeLoseBtn";

import "./Game.scss";
import rollADie from "roll-a-die";

const SERVER_URL = process.env.REACT_APP_DOMAIN;

class Game extends Component {
    constructor(props) {
        super(props);

        const {room} = this.props.match.params;

        this.diceRef = React.createRef();

        this.state = {
            rolledDice: undefined,
            currentValue: 0,
            socket: socketIOClient(SERVER_URL),
            players: [],
            started: false,
            over: false
        };

        this.state.socket.on("connect", () => this.handshake(room));

        this.state.socket.on("gameUpdate", response => {
            this.setState({
                players: response.players,
                started: response.started,
                over: response.over,
                currentValue: response.currentValue
            });
        });

        this.state.socket.on("gameError", data => {
            console.error(data);
            switch (data.code) {
                case "NO_GAME":
                    setTimeout(() => {
                        this.props.history.push("/");
                    }, 2000);
                    break;
                case "NOT_ALLOWED":

                    break;
                case "NOT_YOUR_TURN":

                    break;
                default:
                    console.warn(`gameError sent:[${data.message}] but isn't handled!`);
            }
        });

        this.state.socket.on("rolledDice", dice => {
            this.animateDice(dice);
        });

        this.state.socket.on("lost", (data) => {
            console.warn("PLAYER LOST: " + data.playerId);
        });
    }

    render() {
        const {rolledDice, currentValue, players, started, over} = this.state;
        console.log(this.state);

        const player = this.getPlayer();
        // const currentPlayer = this.getCurrentPlayer();
        const isChoosing = player && player.isPlayersTurn && player.choosing;

        // maybe is spectator
        let controls;
        if (player) {
            let controlButton;

            if (!over) {
                controlButton = <button className={`button ${player.ready ? "success" : "light"}`}
                                        onClick={() => this.ready()}>Ready</button>;
                if (started) {
                    const isWaiting = !player.isPlayersTurn;

                    controlButton = (<div style={{display: "flex"}} className={`${isWaiting ? "waiting" : ""}`}>
                        <button disabled={isWaiting} className="button" onClick={() => this.rollDice()}>Roll</button>
                        <LifeLoseBtn disabled={isWaiting} onClick={() => this.loseLife()}></LifeLoseBtn>
                    </div>);
                }
                controls = (<div className="controls">{controlButton}</div>);
            }

        }

        return (
            <div className="page-container">
                <h5 className="heading">Game</h5>
                <div className="statistics">
                    <div className="rolled-dice">{rolledDice}</div>
                    <div className="current-value">{currentValue}</div>
                </div>

                {controls}

                <div className="players-list">
                    {players.map((player, key) =>
                        <Player player={player} choosing={isChoosing} key={player.id}
                                onClick={() => this.chooseNextPlayer(player.id)}/>
                    )}
                </div>

                <div className="dice" ref={this.diceRef}></div>
            </div>
        );
    }

    getPlayer() {
        const currentPlayerId = sessionStorage.getItem("playerId");
        return this.state.players.find(player => player.id === currentPlayerId);
    }

    getCurrentPlayer() {
        return this.state.players.find(player => player.isPlayersTurn);
    }

    handshake(room) {
        this.state.socket.emit("handshake", {playerId: sessionStorage.getItem("playerId"), room});
    }

    ready() {
        const ready = !this.getPlayer().ready;
        this.state.socket.emit("ready", ready);
    }

    rollDice() {
        if (this.getPlayer().isPlayersTurn) {
            this.state.socket.emit("rollDice");
        }
    }

    loseLife() {
        if (this.getPlayer().isPlayersTurn) {
            this.state.socket.emit("loseLife");
        }
    }

    chooseNextPlayer(playerId) {
        const player = this.getPlayer();
        if (player.isPlayersTurn && player.choosing) {
            console.log("choosing next " + playerId);
            this.state.socket.emit("chooseNextPlayer", playerId);
        }
    }

    animateDice(value) {
        rollADie({
            element: this.diceRef.current,
            numberOfDice: 1,
            delay: 3000,
            callback: () => {
                console.log("done animating");
                this.setState({rolledDice: value});
            },
            values: [value]
        });
    }
}

export default Game;
