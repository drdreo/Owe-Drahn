import React, {Component} from "react";

import "./LifeLoseBtn.scss";

const Heart = () => (
    <svg version="1.1" id="heart" className="icon" x="0px" y="0px" viewBox="-281.5 371.6 52 51">
        <path strokeWidth={2} d="M-255.5,382.3c2-4.8,6.6-8.1,12-8.1c7.2,0,12.4,6.2,13.1,13.5c0,0,0.4,1.8-0.4,5.1c-1.1,4.5-3.5,8.5-6.9,11.5
	l-17.7,15.8l-17.4-15.8c-3.4-3-5.8-7-6.9-11.5c-0.8-3.3-0.4-5.1-0.4-5.1c0.7-7.4,5.9-13.5,13.1-13.5
	C-261.8,374.2-257.5,377.6-255.5,382.3z"/>
        <rect id="minus" x="-265.3" y="391.6" width="19.8" height="4.5"/>
    </svg>
);


class LifeLoseBtn extends Component {
    render() {
        return (
            <button onClick={this.props.onClick} className="button lose-life">
                <Heart/>
            </button>
        );
    }
}

export default LifeLoseBtn;
