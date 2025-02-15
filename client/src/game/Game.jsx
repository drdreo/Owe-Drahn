/*eslint no-fallthrough: ["warn", { "commentPattern": "break omitted" }]*/

import React, {useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";

import diceRoller from "dice-roller-3d";
import {Howl} from "howler";
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
import {useNavigate, useParams} from "react-router-dom";


const MIN_VAL_TO_OWE_DRAHN = 10;

const Game = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {room} = useParams();
    const authUser = useSelector(state => state.auth.authUser); // Redux hook for state
    const settings = useSelector(state => state.settings);
    const players = useSelector(state => state.game.players);
    const rolledDice = useSelector(state => state.game.rolledDice);
    const currentValue = useSelector(state => state.game.currentValue);
    const ui_currentValue = useSelector(state => state.game.ui_currentValue);
    const ui_players = useSelector(state => state.game.ui_players);
    const started = useSelector(state => state.game.started);
    const over = useSelector(state => state.game.over);
    const rolledDice$ = useSelector(state => state.game.rolledDice$);
    const gameError$ = useSelector(state => state.game.gameError$);
    const [animatingDice, setAnimatingDice] = useState(false);
    const [animatingHeart, setAnimatingHeart] = useState(false);
    const [isRolling, setIsRolling] = useState(false);
    const unsubscribe$ = new Subject();
    const diceRef = useRef(null);
    const sfx = {
        yourTurn: {
            played: false, audio: new Howl({src: [yourTurnAudio]})
        }
    };

    const getPlayer = () => {
        const currentPlayerId = localStorage.getItem("playerId");
        return players.find(player => player.id === currentPlayerId);
    }

    const player = getPlayer();
    const isChoosing = player && player.isPlayersTurn && player.choosing;

    useEffect(() => {
        doHandshake(room);

        rolledDice$
            .pipe(takeUntil(unsubscribe$))
            .subscribe((data) => {
                animateDice(data.dice, data.total)
                    .then(() => {
                        console.log(data);
                        let msg;
                        if (data.total > 15) {
                            msg = {
                                type: "LOST",
                                username: data.player.username,
                                dice: data.dice,
                                total: data.total
                            };
                        } else if (!over) {
                            msg = {
                                type: "ROLLED_DICE",
                                username: data.player.username,
                                dice: data.dice,
                                total: data.total
                            };
                        }

                        dispatch(feedMessage(msg));
                    });
            });

        gameError$
            .pipe(takeUntil(unsubscribe$))
            .subscribe((error) => handleGameError(error));

        return () => {
            unsubscribe$.next();
            unsubscribe$.complete();
        };
    }, []);

    useEffect(() => {

        // Change global volume.
        // Howler.mute(!settings.sound.enabled);

        if (!player || !settings.sound.enabled) return;

        if (!animatingDice) {
            // If it's the player's turn and the sound hasn't played yet, play it
            if (player.isPlayersTurn && !sfx.yourTurn.played) {
                sfx.yourTurn.played = true;
                sfx.yourTurn.audio.play();
            }

            // If it's not the player's turn, reset the sound played flag
            if (!player.isPlayersTurn && sfx.yourTurn.played) {
                sfx.yourTurn.played = false;
            }
        }
    }, [player, animatingDice, settings.sound.enabled]);

    const handleGameError = (error) => {
        console.error(error);
        switch (error.code) {
            case "NO_GAME":
                setTimeout(() => {
                    navigate('/');
                }, 2000);
                break;
            case "NOT_ALLOWED":
            case "NOT_YOUR_TURN":
            default:
                console.warn(`gameError sent:[${error.message}] but isn't handled!`);
        }
    }

    // getCurrentPlayer() {
    //     return players.find(player => player.isPlayersTurn);
    // }

    const doHandshake = (room) => {
        const uid = authUser ? authUser.uid : undefined;
        dispatch(handshake(room, uid));
    }

    const handleReady = () => {
        const isReady = !getPlayer().ready;
        dispatch(ready(isReady));
    }

    const handleRollDice = () => {
        const player = getPlayer();
        if (player.isPlayersTurn) {
            if (!isRolling) {
                setIsRolling(true);
                setTimeout(() => {
                    setIsRolling(false);
                }, 1300);
            }
            dispatch(rollDice());
        }
    }

    const handleLoseLife = () => {
        const player = getPlayer();
        if (player.isPlayersTurn && player.life > 1 && currentValue >= MIN_VAL_TO_OWE_DRAHN) {
            if (!animatingHeart) {
                setAnimatingHeart(true);
                // remove the animation class after some arbitrary time. Player won't trigger this again soon
                setTimeout(() => {
                    setAnimatingHeart(false);
                }, 2500);
            }
            dispatch(loseLife());
        }
    }

    const handleChooseNextPlayer = (playerId) => {
        const player = getPlayer();
        if (player.isPlayersTurn && player.choosing) {
            dispatch(chooseNextPlayer(playerId));
        }
    }

    const animateDice = (dice, total) => {
        setAnimatingDice(true);

        return new Promise((resolve) => {
            diceRoller({
                element: diceRef.current,
                numberOfDice: 1,
                delay: 1250,
                callback: () => {
                    setAnimatingDice(false);
                    dispatch(animatedDice({dice, total}));
                    resolve();
                },
                values: [dice],
                noSound: !settings.sound.enabled
            });
        });
    }

    const getPlayerPosition = (index, totalPlayer) => {
        const degrees = (360 / totalPlayer) * index;
        return {transform: ` rotate(${degrees}deg) translateY(-90px) rotate(-${degrees}deg)`};
    }

    // maybe is spectator
    let controls;
    if (player) {
        let controlButton;

        if (!over || animatingDice) {
            if (!animatingDice) {
                if (players.length === 1) {
                    controlButton = "Waiting for Players";
                } else {
                    controlButton = <button className={`button ${player.ready ? "success" : "primary"}`}
                                            onClick={() => handleReady()}>Ready</button>;
                }
            }

            if (started || animatingDice) {
                const isWaiting = !player.isPlayersTurn || animatingDice;

                controlButton = (<div style={{display: "flex"}} className={`${isWaiting ? "waiting" : ""}`}>
                    {/*<button disabled={isWaiting} className="button" onClick={() => handleRollDice()}>Roll</button>*/}
                    <RollButton rolling={isRolling} disabled={isWaiting} onClick={handleRollDice}/>
                    <LifeLoseBtn animating={animatingHeart}
                                 disabled={isWaiting || player.life <= 1 || ui_currentValue < MIN_VAL_TO_OWE_DRAHN}
                                 onClick={handleLoseLife}/>
                </div>);
            }
            controls = (<div className="controls">{controlButton}</div>);
        }
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
                    <Player player={player}
                            choosing={isChoosing}
                            key={player.id}
                            style={getPlayerPosition(index, players.length)}
                            onClick={() => handleChooseNextPlayer(player.id)}/>
                )}
            </div>


            <div className="dice" ref={diceRef}/>
            <Feed/>
            <Settings className="settings"/>
            <GameInfo/>

        </div>
    );
}


export default Game;