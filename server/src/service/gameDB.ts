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
  // allPlayers: Player[] = [];
  // gameHasStarted: boolean = false;
  currentSong: Song | undefined;
  // shuffledSongs: Song[] = [];
  
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

      const shuffledSongs = await this.setupSongs();
      const currentSong = shuffledSongs.at(shuffledSongs.length - 1);
      this.currentSong = currentSong; //update this.currentSong so that the first if statement works? Potentially bad practice?
      const allPlayers = this.getPlayers();

      if (currentSong == null) {
        return undefined;
      }

      const gameHasStarted = true;

      const game = await this.getGame();

      if(game == null) {
        throw new Error(`Game is null :(`);
      }

      //gives game the correct values. 
      game.set({
        allPlayers: allPlayers,
        gameHasStarted: gameHasStarted,
        currentSong: currentSong,
        shuffledSongs: shuffledSongs
      })

      //save the game to the database
      await game.save(); 

      return { currentSong: game.currentSong, players: await this.findPlayersWithSong(game.currentSong) };
    } else {
      return undefined;   //returns undefined if game is already started.
    }
  }

  async getGame() {
    //Since theres only one game and it isn't started yet i.e currentSong is undefined we can find the game like this.
    return gameModel.findOne({currentSong : undefined}).exec(); 
  }
  async addPlayer(username: string, topSongs: Song[]) {
    // creates a new player p with the given username and topsongs and saves it to the db.
    const p = await playerModel.create({
      name: username,
      topSongs: topSongs
    })
    return p;
  }

  private async setupSongs(): Promise<Song[]> {
    //Gets all the songs. 
    const uniqueSongs: Promise<Song[]> = this.findSongs();
    //Gets shuffled array of all songs.
    return await this.shuffleSongs(uniqueSongs);
  }

  async isAlreadyStarted(): Promise<{ gameHasStarted: boolean, currentPlayers: Player[], currentSong?: Song }> {
    const game = await this.getGame();
    if(game == null) {
      throw new Error(`Game is null`);
    }
    if (game.currentSong == null) {
      return { gameHasStarted: game.gameHasStarted, currentPlayers: game.currentPlayers };
    }
    return { gameHasStarted: game.gameHasStarted, currentPlayers: game.allPlayers, currentSong: game.currentSong };
  }

  async nextSong(): Promise<{ currentSong: Song; players: Player[]; } | undefined> {
    const game = await this.getGame();
    if(game == null) {
      throw new Error(`Game is null`);
    }

    if (game.currentSong == null) {
      return undefined;
    } else {
      game.set({
        currentSong : game.shuffledSongs.pop()
      });
      
      if (game.currentSong == null) {
        return undefined;
      }
      return { currentSong: game.currentSong, players: await this.findPlayersWithSong(game.currentSong) }
    }
  }

  async findSongs(): Promise<Song[]> {
    const game = await this.getGame();
    if(game == null) {
      throw new Error(`Game is null`);
    }
    const uniqueSongs: Set<Song> = new Set(game.allPlayers.flatMap((player: { topSongs: any; }) => player.topSongs)); // typescript vill att vi skriver {topSongs : any;} ??
    if (uniqueSongs.size == 0) {
      throw new Error(`The given players have no top songs.`);
    }
    return Array.from(uniqueSongs);
  }

  // Returns all players that have the given song as one of their topsongs. 
  async findPlayersWithSong(currentSong: Song): Promise<Player[]> {
    const game = await this.getGame();
    if(game == null) {
      throw new Error(`Game is null`);
    }
    const playersWithSong: Player[] = game.allPlayers.filter((player: { topSongs: Song[]; }) => player.topSongs.includes(currentSong));
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
