import {useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";

import diceRoller from "dice-roller-3d";
import {Howl} from "howler";
import yourTurnAudio from "../assets/sounds/your_turn.mp3";

import Player from "./Player/Player";
import LifeLoseBtn from "./LifeLoseBtn/LifeLoseBtn";
import Feed from "./Feed/Feed";
import Settings from "../settings/Settings";
import RolledDice from "./RolledDice/RolledDice.jsx";

import {chooseNextPlayer, loseLife, ready, rollDice} from "../socket/socket.actions";
import {animatedDice} from "./game.actions";
import {feedMessage} from "./Feed/feed.actions";

import "./Game.scss";
import RollButton from "./RollButton/RollButton";
import GameInfo from "./GameInfo/GameInfo";
import {useNavigate, useParams} from "react-router-dom";
import {useGameConnection} from "./useGameConnection.js";


const MIN_VAL_TO_OWE_DRAHN = 10;

const Game = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {room} = useParams();
    useGameConnection(room);

    const settings = useSelector(state => state.settings);
    const {
        diceRoll,
        currentValue,
        ui_currentValue,
        ui_players,
        players,
        started,
        over,
        error
    } = useSelector(state => state.game);

    const [animatingDice, setAnimatingDice] = useState(false);
    const [animatingHeart, setAnimatingHeart] = useState(false);
    const [isRolling, setIsRolling] = useState(false);
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
        if (!diceRoll || animatingDice) return;

        setAnimatingDice(true);
        animateDice(diceRoll.dice, diceRoll.total)
            .then(() => {
                setAnimatingDice(false);
                dispatch(animatedDice({
                    dice: diceRoll.dice,
                    total: diceRoll.total
                }));
                let msg;
                if (diceRoll.total > 15) {
                    msg = {
                        type: "LOST",
                        username: diceRoll.player.username,
                        dice: diceRoll.dice,
                        total: diceRoll.total
                    };
                } else if (!over) {
                    msg = {
                        type: "ROLLED_DICE",
                        username: diceRoll.player.username,
                        dice: diceRoll.dice,
                        total: diceRoll.total
                    };
                }

                dispatch(feedMessage(msg));
            });
    }, [diceRoll]);

    useEffect(() => {
        // Change global volume.
        // Howler.mute(!settings.sound.enabled);

        if (!player || !settings.sound.enabled) return;

        if (!animatingDice) {
            // If it's the player's turn and the sound hasn't played yet, play it
            if (player.isPlayersTurn && !player.choosing && !sfx.yourTurn.played) {
                sfx.yourTurn.played = true;
                sfx.yourTurn.audio.play();
            }

            // If it's not the player's turn, reset the sound played flag
            if (!player.isPlayersTurn && sfx.yourTurn.played) {
                sfx.yourTurn.played = false;
            }
        }
    }, [player, animatingDice, settings.sound.enabled]);


    useEffect(() => {
        if (!error) {
            return;
        }
        console.error(error);
        switch (error.code) {
            case "NO_GAME": {
                const timer = setTimeout(() => {
                    navigate('/');
                }, 2000);
                return () => clearTimeout(timer);
            }

            case "NOT_ALLOWED":
            case "NOT_YOUR_TURN":
                console.warn(error.message);
                break;
            default:
                console.warn(`gameError: ${error.message} isn't handled!`);
        }
    }, [error, navigate]);

    // getCurrentPlayer() {
    //     return players.find(player => player.isPlayersTurn);
    // }

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

    const getPlayerPosition = (index, totalPlayers) => {
        const vw = Math.min(window.innerWidth, window.innerHeight);
        const radius = vw < 800 ? vw * 0.35 : 250; // 30% of viewport on mobile, fixed on desktop
        const degrees = (360 / totalPlayers) * index;
        return {
            transform: `
            translateX(-50%)
            translateY(-50%)
            rotate(${degrees}deg) 
            translateY(-${radius}px) 
            rotate(-${degrees}deg)
            `
        };
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
                    <RollButton rolling={isRolling} disabled={isWaiting} onClick={handleRollDice}/>
                    <LifeLoseBtn animating={animatingHeart}
                                 disabled={isWaiting || player.life <= 1 || ui_currentValue < MIN_VAL_TO_OWE_DRAHN}
                                 onClick={handleLoseLife}/>
                </div>);
            }
            controls = (<div className="controls">{controlButton}</div>);
        }
    }

    return (
        <div className="page-container">
            <RolledDice/>

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