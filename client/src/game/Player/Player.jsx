// import {Shield, Crown, Skull} from 'lucide-react';
import rank5 from "../../assets/images/ranks/rank5.png";
import rank10 from "../../assets/images/ranks/rank10.png";
import rank15 from "../../assets/images/ranks/rank15.png";
import rank20 from "../../assets/images/ranks/rank20.png";
import rank25 from "../../assets/images/ranks/rank25.png";
import rank30 from "../../assets/images/ranks/rank30.png";
import rank35 from "../../assets/images/ranks/rank35.png";
import rank40 from "../../assets/images/ranks/rank40.png";
import rank45 from "../../assets/images/ranks/rank45.png";
import rank50 from "../../assets/images/ranks/rank50.png";
import rank55 from "../../assets/images/ranks/rank55.png";

import "./Player.scss";

const Player = ({player, choosing, onClick, style}) => {
    const getRankIcon = (rank) => {
        switch (true) {
            case 5 <= rank && rank < 10:
                return rank5;
            case 10 <= rank && rank < 15:
                return rank10;
            case 15 <= rank && rank < 20:
                return rank15;
            case 20 <= rank && rank < 25:
                return rank20;
            case 25 <= rank && rank < 30:
                return rank25;
            case 30 <= rank && rank < 35:
                return rank30;
            case 35 <= rank && rank < 40:
                return rank35;
            case 40 <= rank && rank < 45:
                return rank40;
            case 45 <= rank && rank < 50:
                return rank45;
            case 50 <= rank && rank < 55:
                return rank50;
            case 55 <= rank:
                return rank55;
            default:
                return "";
        }
    };

    const rankIcon = getRankIcon(player.rank);

    return (
        <div onClick={onClick}
             style={style}
             className={`player ${localStorage.getItem("playerId") === player.id ? "me" : ""} 
            ${player.ready ? "ready" : ""} 
            ${player.isPlayersTurn ? "turn" : ""}
            ${player.life <= 0 ? "lost" : ""}               
            ${choosing ? "choosing" : ""} 
            ${player.rank > 0 ? "has-rank" : ""}`}>
            {player.rank > 0 &&
                <div className="player__rank" title={`Rank ${player.rank}`}>
                    <img src={rankIcon} alt={`Rank ${player.rank}`}/>
                </div>
            }
            <div className="life">
                <div className={`life__bar life-${player.life}`}></div>
                {player.life}
            </div>
            <div className="name" title={player.username.length > 20 ? player.username : ""}>
                <span>{player.username}</span>
            </div>
        </div>
    );
};

export default Player;