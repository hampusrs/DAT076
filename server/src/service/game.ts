import { Song } from "../model/Song";
import { Player } from "../model/Player";

//const gameID: number = 123;

interface IGameService {
  getPlayers(): Promise<{ players: Player[] }>;
  startGame(): Promise<{ currentSong: Song, players: Player[] } | undefined>; // returns undefined is game is already started.
  nextSong(): Promise<{ currentSong: Song, players: Player[] } | undefined>;
}

class GameService implements IGameService {
  allPlayers: Player[] = [];
  gameHasStarted: boolean = false;
  currentSong: Song | undefined;
  shuffledSongs: Song[] =  [];

  //Gets all players
  async getPlayers(): Promise<{ players: Player[] }> {
    return { players: this.allPlayers };
  }

  async startGame(): Promise<{ currentSong: Song, players: Player[] } | undefined> {
    if (this.currentSong == null) {
      this.gameHasStarted = true;
      await this.setupSongs();
      this.currentSong = this.shuffledSongs.at(this.shuffledSongs.length - 1); //Pick first song in shuffledSongs.
      if (this.currentSong == null) {
        return undefined;
      }
      return {currentSong : this.currentSong, players : this.allPlayers}
    } else {
      return undefined;   //returns undefined if game is already started.
    }
  }

  async addPlayer(username: string, topSongs : Song[]) {
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
      this.currentSong = this.shuffledSongs.pop();
      if (this.currentSong == null) {
        return undefined;
      }
      return {currentSong : this.currentSong , players : this.allPlayers}
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
}

export function makeGameService() {
  return new GameService();
}
