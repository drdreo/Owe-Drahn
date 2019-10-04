
/*eslint no-fallthrough: ["warn", { "commentPattern": "break omitted" }]*/

import React, {Component} from "react";
import {connect} from "react-redux";
import {Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";


import diceRoller from "dice-roller-3d";

import Player from "./Player/Player";
import LifeLoseBtn from "./LifeLoseBtn/LifeLoseBtn";
import Feed from "./Feed/Feed";
import Settings from "../settings/Settings";

import {
    chooseNextPlayer,
    handshake,
    loseLife,
    ready,
    rollDice
} from "../socket/socket.actions";
import { animatedDice } from "./game.actions";
import { feedMessage } from "./Feed/feed.actions";

import "./Game.scss";

class Game extends Component {

    unsubscribe$ = new Subject();

    constructor(props) {
        super(props);

        this.state = {
            animatingDice: false
        };

        const { room } = this.props.match.params;
        this.handshake(room);

        this.diceRef = React.createRef();
    }

    componentDidMount() {

        this.props.rolledDice$
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((data) => {
                this.animateDice(data.dice, data.total)
                    .then(() => {
                        console.log(data);
                        if (data.total > 15) {
                            this.props.feedMessage({
                                type: "LOST",
                                username: data.player.username,
                                dice: data.dice,
                                total: data.total
                            });
                        } else if (!this.props.over) {
                            this.props.feedMessage({
                                type: "ROLLED_DICE",
                                username: data.player.username,
                                dice: data.dice,
                                total: data.total
                            });
                        }
                    });
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
        console.log({ error });
        switch (error.code) {
            case "NO_GAME":
                setTimeout(() => {
                    this.props.history.push("/");
                }, 2000);
            // break omitted
            case "NOT_ALLOWED":
            case "NOT_YOUR_TURN":
            default:
                console.warn(`gameError sent:[${error.message}] but isn't handled!`);
        }
    }

    render() {
        const { rolledDice, ui_currentValue, players, started, over } = this.props;

        const player = this.getPlayer();
        // const currentPlayer = this.getCurrentPlayer();
        const isChoosing = player && player.isPlayersTurn && player.choosing;

        // maybe is spectator
        let controls;
        if (player) {
            let controlButton;

            if (!over || this.state.animatingDice) {
                controlButton = <button className={`button ${player.ready ? "success" : "light"}`}
                    onClick={() => this.ready()}>Ready</button>;
                if (started) {
                    const isWaiting = !player.isPlayersTurn || this.state.animatingDice;

                    controlButton = (<div style={{ display: "flex" }} className={`${isWaiting ? "waiting" : ""}`}>
                        <button disabled={isWaiting} className="button" onClick={() => this.rollDice()}>Roll</button>
                        <LifeLoseBtn disabled={isWaiting} onClick={() => this.loseLife()} />
                    </div>);
                }
                controls = (<div className="controls">{controlButton}</div>);
            }

        }

        const totalModifier = ui_currentValue > 15 ? "danger" : ui_currentValue >= 10 ? "warning" : "";

        return (
            <div className="page-container">
                <div className="statistics">
                    <div className="rolled-dice">{rolledDice}</div>
                    <div className={`current-value ${totalModifier}`}>{ui_currentValue}</div>
                </div>

                {controls}

                <div className="players-list">
                    {players.map((player) =>
                        <Player player={player} choosing={isChoosing} key={player.id}
                            onClick={() => this.chooseNextPlayer(player.id)} />
                    )}
                </div>


                <div className="dice" ref={this.diceRef}/>
                <Feed />
                <Settings className="settings" />

            </div>
        );
    }

    getPlayer() {
        const currentPlayerId = sessionStorage.getItem("playerId");
        return this.props.players.find(player => player.id === currentPlayerId);
    }

    // getCurrentPlayer() {
    //     return this.props.players.find(player => player.isPlayersTurn);
    // }

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

    animateDice(dice, total) {
        this.setState({ animatingDice: true });

        return new Promise((resolve) => {
            diceRoller({
                element: this.diceRef.current,
                numberOfDice: 1,
                delay: 1500,
                callback: () => {
                    this.setState({ animatingDice: false });
                    this.props.animatedDice({ dice, total });
                    resolve();
                },
                values: [dice],
                noSound: !this.props.settings.sound.enabled
            });
        });
    }
}

const mapStateToProps = (state) => {
    return { ...state.game, settings: state.settings };
};

const mapDispatchToProps = dispatch => {
    return {
        handshake: (room) => dispatch(handshake(room)),
        ready: (isReady) => dispatch(ready(isReady)),
        feedMessage: (message) => dispatch(feedMessage(message)),
        rollDice: () => dispatch(rollDice()),
        loseLife: () => dispatch(loseLife()),
        chooseNextPlayer: playerId => dispatch(chooseNextPlayer(playerId)),
        animatedDice: value => dispatch(animatedDice(value))
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(Game);
