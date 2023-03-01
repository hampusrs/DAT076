import { Song } from "../model/Song";
import { Player } from "../model/Player";
import { getEnabledCategories } from "trace_events";

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

//const gameID: number = 123;
let gameHasStarted: boolean = false;

let index: number = 0;

interface IGameService {
  getPlayers(): Promise<{ players: Player[] }>;
  startGame(): Promise<{ currentSong: Song, players: Player[] } | undefined>; // returns undefined is game is already started.
  nextSong(): Promise<{ currentSong: Song, players: Player[] }>;
}

class GameService implements IGameService {
  async getPlayers(): Promise<{ players: Player[] }> {   //GetPlayer
    return { players: players };
  }

  async startGame(): Promise<{ currentSong: Song, players: Player[] } | undefined> {
    if (currentSong == null) {
      gameHasStarted = true;
      return this.randomizeNewCurrentSong();
    } else {
      return undefined;   //returns undefined if game is already started.
    }
  }


  async isAlreadyStarted(): Promise<{ gameHasStarted: boolean, currentPlayers: Player[], currentSong?: Song }> {
    if (currentSong == null) {
      return { gameHasStarted: gameHasStarted, currentPlayers: players };
    }
    return { gameHasStarted: gameHasStarted, currentPlayers: players, currentSong: currentSong };
  }

  async nextSong(): Promise<{ currentSong: Song, players: Player[] }> {
    if (currentSong == null) {
      throw new Error(`Game has not started yet`);
    } else {
      return this.randomizeNewCurrentSong();
    }
  }

  async findSongs(): Promise<Song[]> {
    const uniqueSongs: Set<Song> = new Set(players.flatMap(player => player.topSongs));
    return Array.from(uniqueSongs);
  }

  // Returns all players that have the given song as one of their topsongs. 
  async findPlayersWithSong(currentSong: Song): Promise<Player[]> {
    return players.filter(player => player.topSongs.includes(currentSong));
  }

  // Shuffles the given Song array.
  private async shuffleSongs(uniqueSongs : Promise<Song[]>): Promise<Song[]> {
    // Shuffles the uniqueSongs array.
    ([...uniqueSongs]) => {
      let m = uniqueSongs.length;
      while (m) {
        const i = Math.floor(Math.random() * m--);
        [uniqueSongs[m], uniqueSongs[i]] = [uniqueSongs[i], uniqueSongs[m]];
      }
    };
    return uniqueSongs;
  }

  // Should update the global index variable
  private async getNextIndex() : Promise<void> {
    // If the index will still be in range after being increased by one
    // Increse it by one, else set it to zero.
    if(index + 1 < (await this.findSongs()).length) {
      index++;
    } else {
      index = 0;
    }
  }

  private async randomizeNewCurrentSong(): Promise<{ currentSong: Song, players: Player[] }> {
    const uniqueSongs : Promise<Song[]> = this.findSongs();
    //Gets shuffled array of all songs.
    const shuffledSongs: Promise<Song[]> = this.shuffleSongs(uniqueSongs);
    //Updates index.
    this.getNextIndex();
    //Gets the new song that will be the next currentSong.
    let newSong : Song | undefined = (await shuffledSongs)[index];
    if(newSong == null) {
      throw new Error(`No song with index ${index}`);
    }
    //Finds all players with that song in their topsongs.
    const playersWithSong: Promise<Player[]> = this.findPlayersWithSong(newSong);
    //Updates currentSong
    currentSong = newSong;
    return {currentSong: currentSong, players: (await playersWithSong)}
  }
}

export function makeGameService() {
  return new GameService();
}
