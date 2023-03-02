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

const player1: Player = { name: "Bob", topSongs: [song1, song2] };
const player2: Player = { name: "Jane", topSongs: [song2, song3] };

//const gameID: number = 123;

interface IGameService {
  getPlayers(): Promise<{ players: Player[] }>;
  startGame(): Promise<{ currentSong: Song, players: Player[] } | undefined>; // returns undefined is game is already started.
  nextSong(): Promise<{ currentSong: Song, players: Player[] } | undefined>;
}

class GameService implements IGameService {
  allPlayers: Player[] = [player1, player2];
  gameHasStarted: boolean = false;
  currentSong: Song | undefined;
  index: number = 0;           //TABORT
  shuffledSongs: Song[] =  [];

  async getPlayers(): Promise<{ players: Player[] }> {   //GetPlayer
    return { players: this.allPlayers };
  }

  async startGame(): Promise<{ currentSong: Song, players: Player[] } | undefined> {
    console.log(this.currentSong);
    if (this.currentSong == null) {
      this.gameHasStarted = true;
      await this.setupSongs();
      console.log(this.shuffledSongs);
      return this.randomizeNewCurrentSong();
    } else {
      return undefined;   //returns undefined if game is already started.
    }
  }

  private async addPlayer(username: string, topSongs : Song[]) {
    const p: Player = { name: username, topSongs: topSongs };
    if (this.allPlayers.filter((player => player.name == username)).length > 0) {
      throw new Error(`Player with username: ${username} already exists`);
    }
    this.allPlayers.push(p);
  }
  
  private async setupSongs() : Promise<void> {
    //Gets all the songs. 
    const uniqueSongs: Promise<Song[]> = this.findSongs();
    //Gets shuffled array of all songs.
    this.shuffledSongs = await this.shuffleSongs(uniqueSongs);
  }

  async isAlreadyStarted(): Promise<{ gameHasStarted: boolean, currentPlayers: Player[], currentSong?: Song }> {
    if (this.currentSong == null) {
      return { gameHasStarted: this.gameHasStarted, currentPlayers: this.allPlayers };
    }
    return { gameHasStarted: this.gameHasStarted, currentPlayers: this.allPlayers, currentSong: this.currentSong };
  }

  async nextSong(): Promise<{ currentSong: Song; players: Player[]; } | undefined> {
    if (this.currentSong == null) {
      throw new Error(`Game has not started yet`);
    } else {
      return this.randomizeNewCurrentSong();
    }
  }

  async findSongs(): Promise<Song[]> {
    const uniqueSongs: Set<Song> = new Set(this.allPlayers.flatMap(player => player.topSongs));
    return Array.from(uniqueSongs);
  }

  // Returns all players that have the given song as one of their topsongs. 
  async findPlayersWithSong(currentSong: Song): Promise<Player[]> {
    return this.allPlayers.filter(player => player.topSongs.includes(currentSong));
  }

  // Shuffles the given Song array.
  private async shuffleSongs(uniqueSongs: Promise<Song[]>): Promise<Song[]> {
    // Shuffles the uniqueSongs array.

    const shuffle = ([...uniqueSongs]) => {
      let m = uniqueSongs.length;
      while (m) {
        const i = Math.floor(Math.random() * m--);
        [uniqueSongs[m], uniqueSongs[i]] = [uniqueSongs[i], uniqueSongs[m]];
      }
      return uniqueSongs;
    };
    const shuffledSongs = shuffle(await uniqueSongs);
    return shuffledSongs;
  }

  // Should update the global index variable
  private async getNextIndex(): Promise<void> {
    // If the index will still be in range after being increased by one
    // Increse it by one, else set it to zero.
    if (this.index + 1 < (await this.findSongs()).length) {
      this.index++;
    } else {
      this.index = 0;
    }
  }

  private async randomizeNewCurrentSong(): Promise<{ currentSong: Song, players: Player[] }> {
    //Updates index.
    this.getNextIndex();
    //Gets the new song that will be the next currentSong.
    let newSong: Song | undefined = (await this.shuffledSongs)[this.index];
    if (newSong == null) {
      throw new Error(`No song with index ${this.index}`);
    }
    //Finds all players with that song in their topsongs.
    const playersWithSong: Promise<Player[]> = this.findPlayersWithSong(newSong);
    //Updates currentSong
    this.currentSong = newSong;
    return { currentSong: this.currentSong, players: (await playersWithSong) }
  }
}

export function makeGameService() {
  return new GameService();
}
