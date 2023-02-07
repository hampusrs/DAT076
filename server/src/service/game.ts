import { Song } from "../model/Song";
import { Player } from "../model/Player";

const song1: Song = {
  id: 1,
  title: "Firework",
  album: "Teenage Dream",
  artist: "Katy Perry"
};
const song2: Song = {
  id: 2,
  title: "Baby",
  album: "My Worlds",
  artist: "Justin Bieber"
};
const song3: Song = {
  id: 3,
  title: "Levels",
  album: "True",
  artist: "Avicii"
};
let currentSong: Song | undefined;

const player1: Player = { name: "Bob", topSongs: [song1, song2] };
const player2: Player = { name: "Jane", topSongs: [song2, song3] };
const players: Player[] = [player1, player2];

const gameID: number = 123;


interface IGameService {
    getGame() : Promise<Player[]>;
    startGame() : Promise<[Song, Player[]]>;
    nextSong() : Promise<[Song, Player[]]>;
}

class GameService implements IGameService {

  async getGame(): Promise<Player[]> {
    return players;
  }

  async startGame(): Promise<[Song, Player[]]> {
    if (currentSong == null) {
      //find a song;
      //find all players with that song
      // set currentSong to the new song
      currentSong = song1;
      return [currentSong, [player1]]; // <- change this later
    } else {
      throw new Error(`Game has already started`);
    }
  }

  async nextSong(): Promise<[Song, Player[]]> {
    if (currentSong == null) {
      throw new Error(`Game has not started yet`);
    } else {
      // find new song
      // find players who have that song
      // return song and the list of players
      currentSong = song2;
      return [currentSong, [player1, player2]]; // <- change this later
    }

  }

}

export function makeGameService() {
  return new GameService();
}