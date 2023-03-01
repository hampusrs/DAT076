import { Song } from "../model/Song";
import { Player } from "../model/Player";
interface IGameService {
    getPlayers(): Promise<{
        players: Player[];
    }>;
    startGame(): Promise<{
        currentSong: Song;
        players: Player[];
    } | undefined>;
    nextSong(): Promise<{
        currentSong: Song;
        players: Player[];
    }>;
}
declare class GameService implements IGameService {
    getPlayers(): Promise<{
        players: Player[];
    }>;
    startGame(): Promise<{
        currentSong: Song;
        players: Player[];
    } | undefined>;
    nextSong(): Promise<{
        currentSong: Song;
        players: Player[];
    }>;
    findSongs(): Promise<Song[]>;
    findPlayersWithSong(currentSong: Song): Promise<Player[]>;
    private randomizeNewCurrentSong;
}
export declare function makeGameService(): GameService;
export {};
