import React, {useEffect, useState} from "react";
import axios from "axios";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom"; // Use this hook for navigation
import {useFirebase} from "../auth/Firebase"; // Custom hook for Firebase context
import "./Home.scss";
import {gameReset} from "../game/game.actions";
import SignInGoogle from "../auth/SignIn/SignIn";
import {debounce} from "../utils/helpers";

const API_URL = process.env.REACT_APP_API_URL;

const Home = () => {
    const [room, setRoom] = useState("");
    const [username, setUsername] = useState("");
    const [usernameSetFromDB, setUsernameSetFromDB] = useState(false);
    const [overview, setOverview] = useState({rooms: [], totalPlayers: 0});
    const [formError, setFormError] = useState("");

    const navigate = useNavigate();
    const firebase = useFirebase();
    const authUser = useSelector((state) => state.auth.authUser);
    const dispatch = useDispatch();

    useEffect(() => {
        console.log("Home mounted");
        localStorage.removeItem("playerId");
        fetchOverview();
        dispatch(gameReset());
    }, [dispatch]);

    useEffect(() => {
        if (authUser && authUser.username !== username && !usernameSetFromDB) {
            setUsername(authUser.username);
            setUsernameSetFromDB(true);
        } else if (!authUser) {
            setUsernameSetFromDB(false);
        }
    }, [authUser, usernameSetFromDB, username]);

    const updateRoom = (room) => {
        setRoom(room);
    };

    const updateUsername = (evt) => {
        const newUsername = evt.target.value;
        setUsername(newUsername);

        if (authUser) {
            updateDBUsername(newUsername);
        }
    };

    const updateDBUsername = debounce((username) => {
        firebase.user(authUser.uid).update({username});
    }, 200);

    const onRoomClick = (room, started) => {
        if (started) {
            navigate(`/game/${room}`);
        } else {
            updateRoom(room);
        }
    };

    const joinGame = () => {
        const roomEncoded = encodeURIComponent(room);

        axios
            .get(`${API_URL}/join?room=${roomEncoded}&username=${username}`, {
                withCredentials: true,
            })
            .then((response) => {
                if (response.data.error) {
                    const {error} = response.data;
                    if (error.code === "GAME_STARTED") {
                        setFormError(error.message);
                    }
                } else {
                    localStorage.setItem("playerId", response.data.playerId);
                    navigate(`/game/${room}`);
                }
            }).catch(console.error);
    };

    const fetchOverview = () => {
        axios
            .get(`${API_URL}/games/overview`, {withCredentials: true})
            .then((response) => {
                if (response.data) {
                    setOverview(response.data);
                }
            });
    };

    const leaveGame = () => {
        const playerId = localStorage.getItem("playerId");

        axios
            .post(`${API_URL}/leave`, {playerId}, {withCredentials: true})
            .then((response) => {
                localStorage.removeItem("playerId");
            });
    };

    return (
        <div className="page-container">
            <div className="overview">
                <div className="overview__total-players">
                    Online: <span>{overview.totalPlayers}</span>
                </div>
                Rooms
                <div className="overview__rooms">
                    {overview.rooms.map((room) => (
                        <div
                            key={room.room}
                            className={`overview__rooms__entry ${room.started ? "has-started" : ""}`}
                            onClick={() => onRoomClick(room.room, room.started)}
                        >
                            {room.started ? <span className="live"></span> : ""} {room.room}
                        </div>
                    ))}
                </div>
            </div>
            <h4>Owe Drahn</h4>
            <SignInGoogle className={`${authUser ? "is-hidden" : ""} sign-in-form`}/>

            {authUser && (
                <>
                    <div>Hello {authUser.username}</div>
                    <button className="link" onClick={() => firebase.doSignOut()}>
                        Logout?
                    </button>
                </>
            )}
            <div className="form">
                <input
                    className="input username"
                    value={username}
                    onChange={updateUsername}
                    placeholder="Username"
                />
                <input
                    className="input room"
                    value={room}
                    onChange={(evt) => updateRoom(evt.target.value)}
                    placeholder="Room"
                />
                <button className="button join" disabled={!room} onClick={joinGame}>
                    Join
                </button>
            </div>

            <div className={`form__error ${!formError.length ? "is-invisible" : ""}`}>
                {formError}
            </div>
        </div>
    );
};

export default Home;
