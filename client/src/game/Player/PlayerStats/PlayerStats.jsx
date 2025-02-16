import "./PlayerStats.scss";

const PlayerStats = ({username, stats}) => {
    const highlightStats = {
        "Win Rate": `${Math.round((stats.wins / stats.totalGames) * 100)}%`,
        "Games": stats.totalGames,
        "Dice Rolled": stats.rolledDice.reduce((a, b) => a + b, 0),
        "Max Life Loss": stats.maxLifeLoss,
        "Headshot (6 @9)": stats.perfectRoll,
        "Never Lucky (6 @10)": stats.worstRoll,
        "Lucker (3 @15)": stats.luckiestRoll,
        " 21 (6 @15)": stats.rolled21
    };

    return (
        <div className="stats-tooltip">
            <div className="username">
                {username}
            </div>
            <div className="stats-grid">
                {Object.entries(highlightStats).map(([label, value]) => (
                    <div key={label} className="stat-item">
                        <div className="label">{label}</div>
                        <div className="value">{value}</div>
                    </div>
                ))}
            </div>

        </div>
    );
};

export default PlayerStats;