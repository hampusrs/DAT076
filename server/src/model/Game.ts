import { Player } from "./Player";
import { Song } from "./Song";

export class Game {

    currentSong : Song;
    currentPlayer : Player; 
    players : Array<Player>;
    songs : Array<Song>;   //Antar att vi vill ha en lista med songs nu under assignment 2?
    

    constructor(currentSong : Song, currentPlayer : Player, players : Array<Player>, songs : Array<Song>) {
        this.currentSong = currentSong;
        this.currentPlayer = currentPlayer; 
        this.players = players;
        this.songs = songs;
    }

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

}
