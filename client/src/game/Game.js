import React, { Component } from "react";
import socketIOClient from "socket.io-client";
import "./Game.css";

class Dice extends React.Component {
    render() {
        return (
            <div className="dice">
                {this.props.value}
            </div>
        );
    }
}


class Game extends Component {
    constructor() {
        super();
        this.state = {
            rolledDice: undefined,
            socket: socketIOClient("http://127.0.0.1:4000")
        };

        this.state.socket.on("rolledDice", response => {

            if (response.error) {
                console.error(response.error);
            } else {
                this.setState({ rolledDice: response.data })
            }
        });
    }

    componentDidMount() {
        const { room } = this.props.match.params;
        this.state.socket.on("connect", () => this.handshake(room));
    }

    render() {
        const { rolledDice } = this.state;
        console.log(rolledDice);

        return (
            <div style={{ textAlign: "center" }}>
                <h5>Game</h5>
                <button onClick={() => this.rollDice()}>Roll</button>
                {rolledDice &&
                    <Dice value={rolledDice} />
                }
            </div >
        );
    }

    handshake(room) {
        this.state.socket.emit("handshake", room);
    }

    rollDice() {
        this.state.socket.emit("rollDice");
    }
}

export default Game;