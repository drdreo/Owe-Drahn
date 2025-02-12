/*eslint no-fallthrough: ["warn", { "commentPattern": "break omitted" }]*/

import React, {Component} from "react";
import {connect} from "react-redux";
import {Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";

import diceRoller from "dice-roller-3d";
import {Howl, Howler} from "howler";
import yourTurnAudio from "../assets/sounds/your_turn.mp3";

import Player from "./Player/Player";
import LifeLoseBtn from "./LifeLoseBtn/LifeLoseBtn";
import Feed from "./Feed/Feed";
import Settings from "../settings/Settings";

import {chooseNextPlayer, handshake, loseLife, ready, rollDice} from "../socket/socket.actions";
import {animatedDice} from "./game.actions";
import {feedMessage} from "./Feed/feed.actions";

import "./Game.scss";
import RollButton from "./RollButton/RollButton";
import GameInfo from "./GameInfo/GameInfo";
import {compose} from "recompose";
import {withNavigation, withRouter} from "../utils/helpers";


const MIN_VAL_TO_OWE_DRAHN = 10;

class Game extends Component {

    unsubscribe$ = new Subject();
    sfx = {
        yourTurn: {
            played: false, audio: new Howl({src: [yourTurnAudio]})
        }
    };

    constructor(props) {
        super(props);

        this.state = {
            animatingDice: false,
            animatingHeart: false,
            isRolling: false
        };

    }

    componentDidMount() {
        const {room} = this.props.params;
        this.handshake(room);

        this.diceRef = React.createRef();

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
            .subscribe((error) => this.handleGameError(error));
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
                    this.props.navigate('/');
                }, 2000);
                break;
            case "NOT_ALLOWED":
            case "NOT_YOUR_TURN":
            default:
                console.warn(`gameError sent:[${error.message}] but isn't handled!`);
        }
    }

    render() {
        const {rolledDice, ui_currentValue, players, ui_players, started, over} = this.props;

        const player = this.getPlayer();
        // const currentPlayer = this.getCurrentPlayer();
        const isChoosing = player && player.isPlayersTurn && player.choosing;

        // maybe is spectator
        let controls;
        if (player) {
            let controlButton;

            if (!over || this.state.animatingDice) {
                if (!this.state.animatingDice) {
                    if (players.length === 1) {
                        controlButton = "Waiting for Players";
                    } else {
                        controlButton = <button className={`button ${player.ready ? "success" : "primary"}`}
                                                onClick={() => this.ready()}>Ready</button>;
                    }
                }

                if (started || this.state.animatingDice) {
                    const isWaiting = !player.isPlayersTurn || this.state.animatingDice;
                    const isRolling = this.state.isRolling;
                    const animatingHeart = this.state.animatingHeart;

                    controlButton = (<div style={{display: "flex"}} className={`${isWaiting ? "waiting" : ""}`}>
                        {/*<button disabled={isWaiting} className="button" onClick={() => this.rollDice()}>Roll</button>*/}
                        <RollButton rolling={isRolling} disabled={isWaiting} onClick={() => this.rollDice()}/>
                        <LifeLoseBtn animating={animatingHeart}
                                     disabled={isWaiting || player.life <= 1 || ui_currentValue < MIN_VAL_TO_OWE_DRAHN}
                                     onClick={() => this.loseLife()}/>
                    </div>);
                }
                controls = (<div className="controls">{controlButton}</div>);
            }


            this.checkSoundFX(player);
        }

        const totalModifier = ui_currentValue > 15 ? "danger" : ui_currentValue >= 10 ? "warning" : "";

        return (
            <div className="page-container">
                <div className="statistics">
                    <div className={`rolled-dice number-${rolledDice}`}>{rolledDice}</div>
                    <div className={`current-value ${totalModifier}`}>{ui_currentValue}</div>
                </div>

                {controls}

                <div className="players-list">
                    {ui_players.map((player, index) =>
                        <Player player={player} choosing={isChoosing} key={player.id}
                                style={this.getPlayerPosition(index, players.length)}
                                onClick={() => this.chooseNextPlayer(player.id)}/>
                    )}
                </div>


                <div className="dice" ref={this.diceRef}/>
                <Feed/>
                <Settings className="settings"/>
                <GameInfo/>

            </div>
        );
    }

    getPlayer() {
        const currentPlayerId = localStorage.getItem("playerId");
        return this.props.players.find(player => player.id === currentPlayerId);
    }

    // getCurrentPlayer() {
    //     return this.props.players.find(player => player.isPlayersTurn);
    // }

    handshake(room) {
        const uid = this.props.auth.authUser ? this.props.auth.authUser.uid : undefined;
        this.props.handshake(room, uid);
    }

    ready() {
        const ready = !this.getPlayer().ready;
        this.props.ready(ready);
    }

    rollDice() {
        if (this.getPlayer().isPlayersTurn) {
            if (!this.state.isRolling) {
                this.setState({isRolling: true});
                setTimeout(() => {
                    this.setState({isRolling: false});
                }, 1300);
            }
            this.props.rollDice();
        }
    }

    loseLife() {
        const player = this.getPlayer();
        if (player.isPlayersTurn && player.life > 1 && this.props.currentValue >= MIN_VAL_TO_OWE_DRAHN) {
            if (!this.state.animatingHeart) {
                this.setState({animatingHeart: true});
                // remove the animation class after some arbitrary time. Player won't trigger this again soon
                setTimeout(() => {
                    this.setState({animatingHeart: false});
                }, 2500);
            }
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
        this.setState({animatingDice: true});

        return new Promise((resolve) => {
            diceRoller({
                element: this.diceRef.current,
                numberOfDice: 1,
                delay: 1250,
                callback: () => {
                    this.setState({animatingDice: false});
                    this.props.animatedDice({dice, total});
                    resolve();
                },
                values: [dice],
                noSound: !this.props.settings.sound.enabled
            });
        });
    }

    checkSoundFX(player) {
        // Change global volume.
        Howler.mute(!this.props.settings.sound.enabled);

        // play players turn sound FX
        if (player.isPlayersTurn && !this.sfx.yourTurn.played && !this.state.animatingDice) {
            this.sfx.yourTurn.played = true;
            this.sfx.yourTurn.audio.play();
        } else if (!player.isPlayersTurn) {
            this.sfx.yourTurn.played = false;
        }
    }

    getPlayerPosition(index, totalPlayer) {
        const degrees = (360 / totalPlayer) * index;
        return {transform: ` rotate(${degrees}deg) translateY(-90px) rotate(-${degrees}deg)`};
    }
}

const mapStateToProps = (state) => {
    return {...state.game, settings: state.settings, auth: state.auth};
};

const mapDispatchToProps = dispatch => {
    return {
        handshake: (room, uid) => dispatch(handshake(room, uid)),
        ready: (isReady) => dispatch(ready(isReady)),
        feedMessage: (message) => dispatch(feedMessage(message)),
        rollDice: () => dispatch(rollDice()),
        loseLife: () => dispatch(loseLife()),
        chooseNextPlayer: playerId => dispatch(chooseNextPlayer(playerId)),
        animatedDice: value => dispatch(animatedDice(value)),
    };
};

export default compose(
    withNavigation,
    withRouter,
    connect(mapStateToProps, mapDispatchToProps)
)(Game);
