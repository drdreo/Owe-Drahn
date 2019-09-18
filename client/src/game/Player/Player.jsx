import React, {Component} from "react";

import "./Player.scss";

class Player extends Component {
    render() {
        return (
            <div
                className={`player ${sessionStorage.getItem("playerId") === this.props.player.id ? "me" : ""} 
                ${this.props.player.ready ? "ready" : ""} 
                ${this.props.player.isPlayersTurn ? "turn" : ""}
                ${this.props.player.life <= 0 ? "lost" : ""} 
                `}>

                <div className="life">{this.props.player.life}</div>
                <div className="name">{this.props.player.username}</div>
            </div>
        );
    }
}

export default Player;
