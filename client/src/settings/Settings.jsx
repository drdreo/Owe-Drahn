import React, {Component} from "react";
import {connect} from "react-redux";

import "./Settings.scss";
import {toggleFeed, toggleSound} from "./settings.actions";

const Speaker = ({disabled}) => (
    <svg id="Speaker" disabled={disabled} version="1.1"  x="0px" y="0px" viewBox="-278 370 54 54">
        <path d="M-277,387v19l11,0l13.8,12.7c1.4,0.8,3.2-0.2,3.2-1.9v-39.7c0-1.7-1.8-2.7-3.2-1.9L-266,387H-277z"/>
        <line x1="-266" y1="387" x2="-266" y2="392"/>
        <line x1="-266" y1="401" x2="-266" y2="406"/>
        <g className="off">
            <line x1="-242" y1="388" x2="-226" y2="404"/>
            <line x1="-242" y1="404" x2="-226" y2="388"/>
        </g>
        <g className="on">
            <path d="M-242.4,387.4c9.8,9-0.4,18.6-0.4,18.6"/>
            <path d="M-238.6,384.3c12.8,11.8,0,25.2,0,25.2"/>
            <path d="M-234.6,381.2c15.9,14.7,0,31,0,31"/>
        </g>
    </svg>
);

const Feed = ({disabled}) => (
    <svg id="Feed" disabled={disabled} version="1.1" x="0px" y="0px" viewBox="-278 370 54 54">
        <g className="messages">
            <line className="st1" x1="-264.5" y1="391" x2="-237.5" y2="391"/>
            <line className="st1" x1="-264.5" y1="397.2" x2="-237.5" y2="397.2"/>
            <line className="st1" x1="-264.5" y1="403" x2="-237.5" y2="403"/>
        </g>
        <g className="off">
            <line className="st3" x1="-259" y1="389" x2="-243" y2="405"/>
            <line className="st3" x1="-259" y1="405" x2="-243" y2="389"/>
        </g>
        <g>
            <path className="window" d="M-232,414.5h-38c-2.8,0-5-2.3-5-5v-25c0-2.8,2.3-5,5-5h38c2.8,0,5,2.3,5,5v25
		C-227,412.3-229.3,414.5-232,414.5z"/>
        </g>
    </svg>
);

class Settings extends Component {
    icon = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABo
                AAAAaCAYAAACpSkzOAAAA10lEQVRIS+2WURHCMAyGvykAB+AAUMDhAAmgBFACEpCAA7CAAxzAZddyW5auLeOOB9q3rf++P2mzphXxMQaOwDo
                gPQNb4NGHquI+XIBlRCea1VCjpwMsgJuCzYGre9cbtJ4U0CwhyxSJsCS4ejSNfOQpkBxN7fETo5wos7XWBn5rCVvs/zTyWfsljT1bFd2qOi/
                QexQD6/li9P5VytKVYijFQOhE6XTY0BGU3XusO4TVJuTaNPqU7r67A9MmwzLaA7uBRgdAOJ2K0lwRbYBJpqFkctImwngBd3xHGzUO9c8AAAA
                ASUVORK5CYII=`;

    constructor(props) {
        super(props);
        this.state = {
            open: false
        };
    }

    render() {
        const {feed, sound} = this.props;

        console.log(this.props);
        const soundEnabled = sound.enabled;
        const feedEnabled = feed.enabled;

        const menuClass = !this.state.open ? " menu--closed " : "menu--open";

        return (
            <div className={`menu ${menuClass} ${this.props.className}`}>
                <div className={`hamburger`} onClick={() => this.toggleMenu()}>
                    <div className="hamburger-box">
                        <div className="hamburger-inner"/>
                    </div>
                </div>

                <div className={`menu-entries`}>

                    {/*<img className="profile-picture" src="data:image/png;base64,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" />*/}


                    <button className="menu__button" onClick={() => this.props.toggleSound()}>
                        <Speaker disabled={!soundEnabled}/>
                    </button>
                    <button className="menu__button" onClick={() => this.props.toggleFeed()}>
                        <Feed disabled={!feedEnabled}/>
                    </button>
                </div>
            </div>
        );
    }

    toggleMenu() {
        this.setState({open: !this.state.open});
    }
}

const mapStateToProps = (state) => {
    return state.settings;
};

const mapDispatchToProps = dispatch => {
    return {
        toggleSound: () => dispatch(toggleSound()),
        toggleFeed: () => dispatch(toggleFeed())
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(Settings);
