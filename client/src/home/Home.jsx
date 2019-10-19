import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import axios from "axios";
import {connect} from "react-redux";

import {compose} from "recompose";
import {withFirebase} from "../auth/Firebase";

import "./Home.scss";
import {gameReset} from "../game/game.actions";
import {redirectToGame} from "../routing/routing.actions";
import {SignInGoogle} from "../auth/SignIn/SignIn";
import {debounce} from "../utils/helpers";

const API_URL = process.env.REACT_APP_API_URL;

class Home extends Component {
    constructor(props) {
        super(props);
        console.log("HOME constructed!");

        this.state = {
            room: "",
            username: "",
            overview: {
                rooms: [],
                totalPlayers: 0
            }
        };
    }

    componentDidMount() {
        console.log("Home mounted");
        sessionStorage.removeItem("playerId");
        this.fetchOverview();

        // const wasPlayer = !!sessionStorage.getItem("playerId");
        // if (wasPlayer) {
        //     // Probably redundant since socket sends leave when it was in a game
        //     this.leaveGame();
        // }
        // TODO: check why this is not always called
        this.props.resetGameState();


    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.auth) {
            if (nextProps.auth.authUser && nextProps.auth.authUser.username !== this.state.username) {
                this.setState({username: nextProps.auth.authUser.username});
            }
        }
    }

    render() {
        const {totalPlayers, rooms} = this.state.overview;

        const authUser = this.props.auth.authUser;


        return (
            <div className="page-container">
                <div className="overview">
                    <div className="overview__total-players">Online: <span>{totalPlayers}</span></div>
                    Rooms
                    <div className="overview__rooms">

                        {rooms.map(room => {
                            return (
                                <div key={room.room}
                                     className={`overview__rooms__entry ${room.started ? "has-started" : ""}`}
                                     onClick={() => this.onRoomClick(room.room, room.started)}>
                                    {room.started ? <span className="live"></span> : ""} {room.room}
                                </div>
                            );
                        })}

                    </div>
                </div>
                <h4>Owe Drahn</h4>
                <SignInGoogle className={`${authUser ? "is-hidden" : ""}`}/>

                {authUser &&
                <>
                    <div>Hello {authUser.username}</div>
                    <button className="link" onClick={() => this.props.firebase.doSignOut()}>Logout?</button>
                </>
                }
                <div className="form">
                    <input className="input username" value={this.state.username}
                           onChange={evt => this.updateUsername(evt)}
                           placeholder="Username"/>
                    <input className="input room" value={this.state.room}
                           onChange={evt => this.updateRoom(evt.target.value)}
                           placeholder="Room"/>
                    <button className="button join" onClick={() => this.joinGame()}>Join</button>
                </div>
            </div>
        );
    }

    updateRoom(room) {
        this.setState({
            room
        });
    }

    updateUsername(evt) {
        const username = evt.target.value;
        this.setState({
            username
        });

        if (this.props.auth.authUser) {
            this.updateDBUsername(username);
        }
    }

    updateDBUsername = debounce((username) => {
        this.props.firebase.user(this.props.auth.authUser.uid).update({username});
    }, 200);

    onRoomClick(room, started) {
        if (started) {
            this.props.redirectToGame(room);
        } else {
            this.updateRoom(room);
        }
    }

    joinGame() {
        const room = encodeURIComponent(this.state.room);
        const username = this.state.username;

        axios.get(`${API_URL}/join?room=${room}&username=${username}`, {withCredentials: true})
            .then((response) => {
                console.log(response);
                if (response.data.error) {
                    // TODO: show error
                    console.log(response.data.error);
                } else {
                    sessionStorage.setItem("playerId", response.data.playerId);
                    this.props.redirectToGame(room);
                }

            });
    }

    fetchOverview() {
        axios.get(`${API_URL}/games/overview`, {withCredentials: true})
            .then((response) => {
                console.log(response);
                if (response.data) {
                    this.setState({overview: response.data});
                }

            });
    }

    leaveGame() {
        const playerId = sessionStorage.getItem("playerId");

        axios.post(`${API_URL}/leave`, {playerId}, {withCredentials: true})
            .then((response) => {
                console.log(response);
                sessionStorage.removeItem("playerId");
            });
    }
}


const mapStateToProps = (state) => {
    return {auth: state.auth};
};


const mapDispatchToProps = dispatch => {
    return {
        resetGameState: () => dispatch(gameReset()),
        redirectToGame: (room) => dispatch(redirectToGame(room))
    };
};


export default compose(
    withFirebase,
    connect(mapStateToProps, mapDispatchToProps)
)(withRouter(Home));
