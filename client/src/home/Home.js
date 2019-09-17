import React, { Component } from "react";
import { withRouter } from 'react-router-dom';

class Home extends Component {
    constructor() {
        super();
        this.state = {
            room: ""
        };

    }

    render() {
        return (
            <div style={{ textAlign: "center" }}>
                <h5>test</h5>
                <input value={this.state.room} onChange={evt => this.updateRoom(evt)} />
                <button onClick={() => this.joinGame()}>Click</button>
            </div >
        );
    }

    updateRoom(evt) {
        this.setState({
            room: evt.target.value
        });
    }

    joinGame() {
        const room = this.state.room;
        this.props.history.push('/game/' + room);
    }
}

export default withRouter(Home)
