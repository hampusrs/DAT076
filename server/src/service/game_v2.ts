import { Song } from "../model/Song";
import { Player } from "../model/Player";
import { playerModel } from "../../db/player.db";

const song1: Song = {
  id: 1,
  title: "Firework",
  album: "Teenage Dream",
  artist: "Katy Perry",
};
const song2: Song = {
  id: 2,
  title: "Baby",
  album: "My Worlds",
  artist: "Justin Bieber",
};
const song3: Song = {
  id: 3,
  title: "Levels",
  album: "True",
  artist: "Avicii",
};


const player1: Player = { name: "Bob", topSongs: [song1, song2] };
const player2: Player = { name: "Jane", topSongs: [song2, song3] };
const players: Player[] = [player1, player2];

//const gameID: number = 123;

interface IGameService {
  getPlayers(): Promise<Player[]>;
  startGame(): Promise<{currentSong : Song, players : Player[]} | undefined>; // returns undefined is game is already started.
  nextSong(): Promise<{currentSong : Song, players : Player[]}>;
}

class GameService implements IGameService {

  currentSong: Song | undefined;
  
  async getPlayers(): Promise<Player[]> {   //GetPlayer
    return await playerModel.find();
  }

  async startGame(): Promise<{currentSong :Song, players : Player[]} | undefined> {
    if (this.currentSong == null) {
      return this.randomizeNewCurrentSong();
    } else {
      return undefined;   //returns undefined if game is already started.
    }
  }

  async nextSong(): Promise<{currentSong : Song, players : Player[]}> {
    if (this.currentSong == null) {
      throw new Error(`Game has not started yet`);
    } else {
      return this.randomizeNewCurrentSong(); 
    }
  }

  async findSongs(): Promise<Song[]> {
    const uniqueSongs: Set<Song> = new Set(players.flatMap(player => player.topSongs))
    return Array.from(uniqueSongs);
  }

  async findPlayersWithSong(currentSong: Song): Promise<Player[]> {
    return players.filter(player => player.topSongs.includes(currentSong))
  }

  private async randomizeNewCurrentSong(): Promise<{currentSong : Song, players : Player[]}> {
    //find a song;
    const uniqueSongs: Promise<Song[]> = this.findSongs();
    const randIndex: number = Math.floor(
      Math.random() * (await uniqueSongs).length
    );
    const newSong: Song | undefined = (await uniqueSongs)[randIndex];
    if (newSong == null) {
      throw new Error(`No song with index ${randIndex}`); // check that index is within bounds
    } 
    //find all players with that song
    const playersWithSong: Promise<Player[]> =
      this.findPlayersWithSong(newSong);
    // set currentSong to the new song
    this.currentSong = newSong;
    return {currentSong : this.currentSong, players : (await playersWithSong)}
  }
}

export function makeGameService() {
  return new GameService();
}
