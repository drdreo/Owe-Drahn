import React, {Component} from "react";
import {connect} from "react-redux";
import {Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";

import diceRoller from "dice-roller-3d";

import Player from "./Player/Player";
import LifeLoseBtn from "./LifeLoseBtn/LifeLoseBtn";
import Feed from "./Feed/Feed";

import "./Game.scss";
import {chooseNextPlayer, handshake, loseLife, ready, rollDice} from "../socket/socket.actions";


class Game extends Component {

    unsubscribe$ = new Subject();

    constructor(props) {
        super(props);

        const {room} = this.props.match.params;
        this.handshake(room);

        this.diceRef = React.createRef();

    }

    componentDidMount() {

        this.props.rolledDice$
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((value) => {
                console.log({value});
                if (value) {
                    this.animateDice(value);
                }
            });

        this.props.gameError$
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(this.handleGameError);
    }

    componentWillUnmount() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    handleGameError(error) {
        console.log({error});
        switch (error.code) {
            case "NO_GAME":
                setTimeout(() => {
                    this.props.history.push("/");
                }, 2000);
            case "NOT_ALLOWED":
            case "NOT_YOUR_TURN":
            default:
                console.warn(`gameError sent:[${error.message}] but isn't handled!`);
        }
    }

    render() {
        const {rolledDice, currentValue, players, started, over} = this.props;

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
                <div className="statistics">
                    <div className="rolled-dice">{rolledDice}</div>
                    <div className={`current-value ${currentValue >= 10 ? "warning" : ""}`}>{currentValue}</div>
                </div>

                {controls}

                <div className="players-list">
                    {players.map((player, key) =>
                        <Player player={player} choosing={isChoosing} key={player.id}
                                onClick={() => this.chooseNextPlayer(player.id)}/>
                    )}
                </div>

                <div className="dice" ref={this.diceRef}></div>
                <Feed/>
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
        if (this.getPlayer().isPlayersTurn && this.props.currentValue > 9) {
            this.props.loseLife();
        }
    }

    chooseNextPlayer(playerId) {
        const player = this.getPlayer();
        if (player.isPlayersTurn && player.choosing) {
            this.props.chooseNextPlayer(playerId);
        }
    }

    animateDice(value) {
        diceRoller({
            element: this.diceRef.current,
            numberOfDice: 1,
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
