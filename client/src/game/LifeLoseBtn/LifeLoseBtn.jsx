import React, {Component} from "react";

import "./LifeLoseBtn.css";

class LifeLoseBtn extends Component {
    render() {
        return (
            <button onClick={this.props.onClick} className="life-lose-btn">Owe Drahn</button>
        );
    }
}

export default LifeLoseBtn;
