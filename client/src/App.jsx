import React, {Component} from "react";
import {Route, Routes} from "react-router-dom";

import withAuthentication from "./auth/Session/withAuthentication";

import Home from "./home/Home";
import Game from "./game/Game";

import "./App.scss";

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/game/:room" element={<Game/>}/>
        </Routes>
    );
};

export default withAuthentication(App);
