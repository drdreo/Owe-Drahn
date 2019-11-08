import { PlayerStats } from "src/game/game.utils";

export interface User {
    stats: PlayerStats;
    username: string;
    email: string;
    uid: string;
}