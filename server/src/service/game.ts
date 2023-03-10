import { Song } from "../model/Song";
import { Player } from "../model/Player";
import { playerModel } from "../../db/player.db";
import { gameModel } from "../../db/game.db";
// import { songModel } from "../../db/song.db";

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
    return this.allPlayers;
  }

  async startGame(): Promise<{ currentSong: Song, players: Player[] } | undefined> {
    if (this.currentSong == null) {

      // These three lines will drop all data from the database. 
      // Which is needed since we dont want ended games to be stored. But these cannot be called here.
      // gameModel.collection.drop();
      // playerModel.collection.drop();
      // songModel.collection.drop();

      await this.setupSongs(); //updates this.shuffledSongs
      this.currentSong = this.shuffledSongs.at(this.shuffledSongs.length - 1);

      if (this.game == null) {
        throw new Error(`Game is null :( 213`);
      }
      await gameModel.updateOne(
        { _id: (await this.game)._id },
        {
          $set: {
            allPlayers: this.allPlayers,
            currentSong: this.currentSong,
            shuffledSongs: this.shuffledSongs
          }
        }
      );

      if (this.currentSong == null) {
        console.log("1-------------------------");
        return undefined;
      }

      this.gameHasStarted = true;
      await gameModel.updateOne(
        { _id: (await this.game)._id },
        {
          $set: {
            gameHasStarted: this.gameHasStarted
          }
        }
      );

      return { currentSong: this.currentSong, players: await this.findPlayersWithSong(this.currentSong) };
    } else {
      console.log("2-------------------------");
      return undefined;   //returns undefined if game is already started.
    }
  }

  // async getGame() {
  //   //Since theres only one game and it isn't started yet i.e currentSong is undefined we can find the game like this.
  //   return await gameModel.findOne().exec();
  // }

  async addPlayer(username: string, topSongs: Song[]) {
    // const game = await this.getGame();
    // if (game == null) {
    //   throw new Error(`Game is null`);
    // }

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
    await p.save();

    await gameModel.updateOne(
      { _id: (await this.game)._id },
      {
        $set: {
          allPlayers: this.allPlayers
        }
      }
    );

    return pl;
  }

  private async setupSongs(): Promise<void> {
    //Gets all the songs. 
    const uniqueSongs: Promise<Song[]> = this.findSongs();
    //Gets shuffled array of all songs.
    this.shuffledSongs = await this.shuffleSongs(uniqueSongs);

    await gameModel.updateOne(
      { _id: (await this.game)._id },
      {
        $set: {
          shuffledSongs: this.shuffledSongs
        }
      }
    );
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

  async recoverDataFromDatabase(): Promise<undefined | {allPlayers: Player[], gameHasStarted: boolean, currentSong: Song, shuffledSongs: Song[]}> {
    await gameModel.find({ _id: (await this.game)._id }, (err: any, obj: any) => {
      this.allPlayers = obj[0].toObject().allPlayers;
      this.currentSong = obj[0].toObject().currentSong;
      this.gameHasStarted = obj[0].toObject().gameHasStarted;
      this.shuffledSongs = obj[0].toObject().shuffledSongs;
      
      if(err) {
        return undefined;
      } else {
        return {allPlayers: this.allPlayers, gameHasStarted: this.gameHasStarted, currentSong: this.currentSong, shuffledSongs: this.shuffledSongs};
      }
    });
    return undefined;
  }

  async nextSong(): Promise<{ currentSong: Song; players: Player[]; } | undefined> {
    // const game = await this.getGame();
    // if (game == null) {
    //   throw new Error(`Game is null`);
    // }

    if (this.currentSong == null) {
      return undefined;
    } else {
      this.currentSong = this.shuffledSongs.pop();
      await gameModel.updateOne(
        { _id: (await this.game)._id },
        {
          $set: {
            currentSong: this.currentSong,
            shuffledSongs: this.shuffledSongs
          }
        }
      );

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
