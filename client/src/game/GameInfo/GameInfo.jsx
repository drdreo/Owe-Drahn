import React, {Component} from "react";
import {connect} from "react-redux";

import "./GameInfo.scss";

class GameInfo extends Component {
    render() {

        const message = this.props.message;
        return (
            <div className={`info ${message.length === 0 ? "hidden" : ""}`}>
                {message}
            </div>

        );
    }
}

const mapStateToProps = (state) => {
    return {...state.game.gameInfo};
};

export default connect(mapStateToProps)(GameInfo);
