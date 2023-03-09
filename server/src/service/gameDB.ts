import { Song } from "../model/Song";
import { Player } from "../model/Player";
import { playerModel } from "../../db/player.db";
import { gameModel } from "../../db/game.db";

//const gameID: number = 123;

interface IGameService {
  // returns all the players currently in the game.
  getPlayers(): Promise<Player[]>;
  // returns undefined is game is already started or there are no songs left.
  startGame(): Promise<{ currentSong: Song, players: Player[] } | undefined>;
  // returns undefined if game is already started or there are no songs left.
  nextSong(): Promise<{ currentSong: Song, players: Player[] } | undefined>;
  // returns undefined if player already exist.
  addPlayer(username: string, topSongs: Song[]): Promise<Player | undefined>;
  // returns object without currentSong if it is undefined.
  isAlreadyStarted(): Promise<{ gameHasStarted: boolean, currentPlayers: Player[], currentSong?: Song }>;
}

class GameService implements IGameService {
  allPlayers: Player[] = [];
  gameHasStarted: boolean = false;
  currentSong: Song | undefined;
  shuffledSongs: Song[] = [];
  
  //Creates a game in the database.
  game = gameModel.create({
    allPlayers: [],
    gameHasStarted: false,
    currentSong: undefined,
    shuffledSongs: []
  });

  //Gets all players
  async getPlayers(): Promise<Player[]> {
    const players = playerModel.find().exec();
    return players;
  }

  async startGame(): Promise<{ currentSong: Song, players: Player[] } | undefined> {
    if (this.currentSong == null) {

      await this.setupSongs(); //updates this.shuffledSongs
      this.currentSong = this.shuffledSongs.at(this.shuffledSongs.length - 1);
      this.gameHasStarted = true;

      const game = await this.getGame();

      if(game == null) {
        throw new Error(`Game is null :(`);
      }

      //gives game the correct values. 
      game.set({
        allPlayers: this.allPlayers,
        gameHasStarted: this.gameHasStarted,
        currentSong: this.currentSong,
        shuffledSongs: this.shuffledSongs
      })

      //save the game to the database
      await game.save(); 

      if(this.currentSong == null) {
        return undefined;
      }

      return { currentSong: this.currentSong, players: await this.findPlayersWithSong(this.currentSong) };
    } else {
      return undefined;   //returns undefined if game is already started.
    }
  }

  async getGame() {
    //Since theres only one game and it isn't started yet i.e currentSong is undefined we can find the game like this.
    return gameModel.findOne({currentSong : undefined}).exec(); 
  }

  async addPlayer(username: string, topSongs: Song[]) {
    
    const pl: Player = { name: username, topSongs: topSongs };
    if (this.allPlayers.filter((player => player.name == username)).length > 0) {
      return undefined;
    }
    this.allPlayers.push(pl);
    
    // for the database
    // creates a new player p with the given username and topsongs and saves it to the db.
    const p = await playerModel.create({
      name: username,
      topSongs: topSongs
    })
    p.save(); //??

    return pl; 
  }

  private async setupSongs(): Promise<Song[]> {
    //Gets all the songs. 
    const uniqueSongs: Promise<Song[]> = this.findSongs();
    //Gets shuffled array of all songs.
    return await this.shuffleSongs(uniqueSongs);
  }

  async isAlreadyStarted(): Promise<{ gameHasStarted: boolean, currentPlayers: Player[], currentSong?: Song }> {
    // const game = await this.getGame();
    // if(game == null) {
    //   throw new Error(`Game is null`);
    // }
    if (this.currentSong == null) {
      return { gameHasStarted: this.gameHasStarted, currentPlayers: this.allPlayers };
    }
    return { gameHasStarted: this.gameHasStarted, currentPlayers: this.allPlayers, currentSong: this.currentSong };
  }

  async nextSong(): Promise<{ currentSong: Song; players: Player[]; } | undefined> {
    const game = await this.getGame();
    if(game == null) {
      throw new Error(`Game is null`);
    }

    if (this.currentSong == null) {
      return undefined;
    } else {
      this.currentSong = this.shuffledSongs.pop();
      game.set({
        currentSong : this.currentSong
      });
      
      if (this.currentSong == null) {
        return undefined;
      }
      return { currentSong: this.currentSong, players: await this.findPlayersWithSong(this.currentSong) }
    }
  }

  async findSongs(): Promise<Song[]> {
    // const game = await this.getGame();
    // if(game == null) {
    //   throw new Error(`Game is null`);
    // }

    const uniqueSongs: Set<Song> = new Set(this.allPlayers.flatMap(player => player.topSongs)); 
    if (uniqueSongs.size == 0) {
      throw new Error(`The given players have no top songs.`);
    }
    return Array.from(uniqueSongs);
  }

  // Returns all players that have the given song as one of their topsongs. 
  async findPlayersWithSong(currentSong: Song): Promise<Player[]> {
    // const game = await this.getGame();
    // if(game == null) {
    //   throw new Error(`Game is null`);
    // }

    const playersWithSong: Player[] = this.allPlayers.filter(player => player.topSongs.includes(currentSong));
    if (playersWithSong.length == 0) {
      throw new Error(`No player have this song as one of their top songs.`);
    }
    return playersWithSong;
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
