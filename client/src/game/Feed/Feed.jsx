import React, {Component} from "react";
import {connect} from "react-redux";

import FeedMessage from "./FeedMessage/FeedMessage";
import "./Feed.scss";

class Feed extends Component {

    constructor(props) {
        super(props);
        this.feedRef = React.createRef();
    }

    render() {
        const {messages, enabled} = this.props;

        if (!enabled) {
            return null;
        }

        if (this.feedRef.current) {
            setTimeout(() => {
                this.scrollToBottom();
            }, 10);
        }
        return (
            <div className="feed" ref={this.feedRef}>
                {messages.map((message, key) =>
                    <FeedMessage message={message} key={key}/>
                )}
            </div>
        );
    }

    scrollToBottom() {
        this.feedRef.current.scrollTop = this.feedRef.current.scrollHeight + 21;
    }
}

const mapStateToProps = (state) => {
    return {...state.feed, enabled: state.settings.feed.enabled};
};

export default connect(mapStateToProps)(Feed);
