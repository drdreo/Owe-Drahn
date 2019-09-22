import React, {Component} from "react";
import {connect} from "react-redux";
import rollADie from "roll-a-die";

import Player from "./Player/Player";
import LifeLoseBtn from "./LifeLoseBtn/LifeLoseBtn";

import "./Game.scss";
import {chooseNextPlayer, handshake, loseLife, ready, rollDice} from "../socket/socket.actions";


class Game extends Component {
    constructor(props) {
        super(props);

        const {room} = this.props.match.params;
        this.handshake(room);

        this.diceRef = React.createRef();

    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.gameError.noGame) {
            setTimeout(() => {
                this.props.history.push("/");
            }, 2000);
        }

        if (prevProps.rolledDice) {
            console.log(prevProps.rolledDice);
            this.animateDice(prevProps.rolledDice);
        }
    }

    render() {
        const {rolledDice, currentValue, players, started, over} = this.props;
        console.log(this.props);

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
                        <LifeLoseBtn disabled={isWaiting} onClick={() => this.loseLife()}/>
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
        return this.props.players.find(player => player.id === currentPlayerId);
    }

    getCurrentPlayer() {
        return this.props.players.find(player => player.isPlayersTurn);
    }

    handshake(room) {
        this.props.handshake(room);
    }

    ready() {
        const ready = !this.getPlayer().ready;
        this.props.ready(ready);
    }

    rollDice() {
        if (this.getPlayer().isPlayersTurn) {
            this.props.rollDice();
        }
    }

    loseLife() {
        if (this.getPlayer().isPlayersTurn) {
            this.props.loseLife();
        }
    }

    chooseNextPlayer(playerId) {
        const player = this.getPlayer();
        if (player.isPlayersTurn && player.choosing) {
            console.log("choosing next " + playerId);
            this.props.chooseNextPlayer(playerId);
        }
    }

    animateDice(value) {
        rollADie({
            element: this.diceRef.current,
            numberOfDice: 1,
            delay: 3000,
            callback: () => {
                console.log("done animating");
            },
            values: [value]
        });
    }
}

const mapStateToProps = (state) => {
    return state.game;
};

const mapDispatchToProps = dispatch => {
    return {
        handshake: (room) => dispatch(handshake(room)),
        ready: (isReady) => dispatch(ready(isReady)),
        rollDice: () => dispatch(rollDice()),
        loseLife: () => dispatch(loseLife()),
        chooseNextPlayer: playerId => dispatch(chooseNextPlayer(playerId))
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(Game);
