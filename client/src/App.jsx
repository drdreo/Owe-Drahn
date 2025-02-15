import {Route, Routes} from "react-router-dom";

import Home from "./home/Home";
import Game from "./game/Game";

import "./App.scss";
import {useAuth} from "./auth/hooks/useAuth.js";

const App = () => {
    useAuth();

    return (
        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/game/:room" element={<Game/>}/>
        </Routes>
    );
};

export default App;
