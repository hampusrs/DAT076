import { Song } from "../model/Song";
import { Player } from "../model/Player";

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
let currentSong: Song | undefined;

const player1: Player = { name: "Bob", topSongs: [song1, song2] };
const player2: Player = { name: "Jane", topSongs: [song2, song3] };
const players: Player[] = [player1, player2];

const gameID: number = 123;

interface IGameService {
  getGame(): Promise<Player[]>;
  startGame(): Promise<[Song, Player[]]>;
  nextSong(): Promise<[Song, Player[]]>;
}

class GameService implements IGameService {
  async getGame(): Promise<Player[]> {
    return players;
  }

  async startGame(): Promise<[Song, Player[]]> {
    if (currentSong == null) {
      return this.randomizeNewCurrentSong();
    } else {
      throw new Error(`Game has already started`);
    }
  }

  async nextSong(): Promise<[Song, Player[]]> {
    if (currentSong == null) {
      throw new Error(`Game has not started yet`);
    } else {
      return this.randomizeNewCurrentSong(); 
    }
  }

  async findSongs(): Promise<Song[]> {
    const uniqueSongs: Set<Song> = new Set();

    players.forEach((player) => {
      player.topSongs.forEach((song) => {
        uniqueSongs.add(song);
      });
    });
    return Array.from(uniqueSongs);
  }

  async findPlayersWithSong(currentSong: Song): Promise<Player[]> {
    const playerWithSong : Player[] = [];
    players.forEach( (player) => {
      if (player.topSongs.includes(currentSong)) {
        playerWithSong.push(player);
      }
    });
    return playerWithSong;
  }

  async randomizeNewCurrentSong(): Promise<[Song, Player[]]> {
    //find a song;
    const uniqueSongs: Promise<Song[]> = this.findSongs();
    const randIndex: number = Math.floor(
      Math.random() * (await uniqueSongs).length
    );
    const newSong: Song = (await uniqueSongs)[randIndex];
    //find all players with that song
    const playersWithSong: Promise<Player[]> =
      this.findPlayersWithSong(newSong);
    // set currentSong to the new song
    currentSong = newSong;
    return [currentSong, (await playersWithSong)]
  }
}

export function makeGameService() {
  return new GameService();
}
