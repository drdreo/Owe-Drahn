import { PlayerStats } from "../game/game.utils";

export interface User {
    stats: PlayerStats;
    username: string;
    email: string;
    uid: string;
}
