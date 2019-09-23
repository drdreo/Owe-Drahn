import React, {Component} from "react";

import "./FeedMessage.scss";


const RolledDiceMessage = ({username, dice, total}) => {
    return (<div className="message message__rolled">
        {username} rolled <span className="message__rolled__dice">{dice}</span> to {total}
    </div>);
};

const LostLifeMessage = ({username}) => {
    return (<div className="message message__lost-life">{username} lost a life!</div>);
};

const LostMessage = ({username, dice, total}) => {
    return (<div className="message message__lost">{username} rolled <span className="message__rolled__dice">{dice}</span> and lost with {total}!</div>);
};


class FeedMessage extends Component {
    render() {
        const {message} = this.props;

        let msgContent;
        switch (message.type) {
            case "ROLLED_DICE":
                msgContent = <RolledDiceMessage username={message.username} dice={message.dice} total={message.total}/>;
                break;
            case "LOST_LIFE":
                msgContent = <LostLifeMessage username={message.username}/>;
                break;
            case "LOST":
                msgContent = <LostMessage username={message.username} dice={message.dice} total={message.total}/>;
                break;
            default:
                break;
        }

        return msgContent;
    }
}

export default FeedMessage;
