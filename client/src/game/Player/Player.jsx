import React, {Component} from "react";

import "./Player.css";

class Player extends Component {
    render() {
        return (
            <div
                className={`player ${sessionStorage.getItem("playerId") === this.props.player.id ? "me" : ""} ${this.props.player.ready ? "ready" : ""} ${this.props.player.isPlayersTurn ? "turn" : ""}`}>

                <div className="life">{this.props.player.life}</div>
                <div className="name">{this.props.player.username}</div>
            </div>
        );
    }
}

export default Player;
