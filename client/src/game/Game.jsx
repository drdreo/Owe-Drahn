import React, {Component} from "react";
import socketIOClient from "socket.io-client";
import "./Game.css";
import Player from "./Player/Player";
import LifeLoseBtn from "./LifeLoseBtn/LifeLoseBtn";


class Game extends Component {
    constructor(props) {
        super(props);

        this.diceRef = React.createRef();

        this.state = {
            rolledDice: undefined,
            currentValue: 0,
            socket: socketIOClient("http://localhost:4000"),
            players: [],
            started: false,
            over: false
        };


        this.state.socket.on("gameUpdate", response => {
            this.setState({
                players: response.data.players,
                started: response.data.started,
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

        this.state.socket.on("lost", () => {
            console.warn("PLAYER LOST");
        });
    }

    componentDidMount() {
        const {room} = this.props.match.params;
        this.state.socket.on("connect", () => this.handshake(room));
    }

    render() {
        const {rolledDice, currentValue, players, started} = this.state;
        console.log(this.state);

        let controlButton;
        if (started) {
            controlButton = (<div>
                <button onClick={() => this.rollDice()}>Wurf</button>
                <LifeLoseBtn onClick={() => this.loseLife()}></LifeLoseBtn>
            </div>);
        } else {
            controlButton = <button onClick={() => this.ready()}>Ready</button>;
        }

        return (
            <div className="page-container">
                <h5>Game</h5>
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
            callback: () => {
                this.setState({rolledDice: value});
            },
            values: [value]
        });
    }
}

export default Game;
