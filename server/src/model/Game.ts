import { Player } from "../model/Player";
import { Song } from "../model/Song";

export class Game {
    gameID: number;
    currentSong: Song | undefined;
    currentPlayer: Player | undefined;
    players : Array<Player>;
    songs : Array<Song>;

    constructor(gameID: number, players : Array<Player>, songs : Array<Song>) {
        this.players = players;
        this.songs = songs;
        this.gameID = gameID;
    }
    /*
    printSong() : void {
        console.log(this.currentSong);
    }

    revealPlayer() : void {
        console.log(this.currentPlayer);
    }

    //Kanske rimligt att göra såhär. (tar inte hänsyn till indexOutOfBound just nu dock).
    nextSong() : void {
        this.currentSong = this.songs[this.getNextSongIndex()];
    }
    
    getNextSongIndex() : number {
        return (this.songs.indexOf(this.currentSong) + 1); 
    }
    */

}
