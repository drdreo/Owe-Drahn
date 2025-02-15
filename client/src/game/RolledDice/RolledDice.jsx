import {useSelector} from "react-redux";

import "./RolledDice.scss";

const RolledDice = () => {
    const ui_currentValue = useSelector(state => state.game.ui_currentValue);
    const rolledDice = useSelector(state => state.game.rolledDice);
    const totalModifier = ui_currentValue > 15 ? "danger" : ui_currentValue >= 10 ? "warning" : "";

    return (
        <div className="statistics">
            <div className={`rolled-dice number-${rolledDice}`}>{rolledDice}</div>
            <div className={`current-value ${totalModifier}`}>{ui_currentValue}</div>
        </div>
    );
}


export default RolledDice;
