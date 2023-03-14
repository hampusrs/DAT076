import { Song } from "../model/Song";
import { Player } from "../model/Player";
import { gameModel } from "../../schema/game.db";

interface IGameService {
  // returns all the players currently in the game.
  getPlayers(): Promise<{ players: Player[] }>;

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
  currentSong: Song | undefined = undefined;
  shuffledSongs: Song[] = [];
  playersAreRevealed: boolean = false;

  //Creates a game in the database.
  game = gameModel.create({
    allPlayers: [],
    gameHasStarted: false,
    currentSong: undefined,
    shuffledSongs: []
  });

  async revealPlayers(): Promise<{ playersAreRevealed: boolean }> {
    this.playersAreRevealed = true;
    return { playersAreRevealed: this.playersAreRevealed };
  }

  async hidePlayers(): Promise<{ playersAreRevealed: boolean }> {
    this.playersAreRevealed = false;
    return { playersAreRevealed: this.playersAreRevealed };
  }


  //Gets all players
  async getPlayers(): Promise<{ players: Player[] }> {
    return { players: this.allPlayers };
  }


  async startGame(): Promise<{ currentSong: Song, players: Player[] } | undefined> {
    if (this.gameHasStarted == true) {
      return undefined;
    }
    if (this.currentSong == null) {

      await this.dropDB();
      //updates this.shuffledSongs
      await this.setupSongs();
      this.currentSong = this.shuffledSongs.pop();

      if (this.game == null) {
        throw new Error(`Game is null`);
      }
      //updates the database
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


      this.gameHasStarted = true;

      //updates the database
      await gameModel.updateOne(
        { _id: (await this.game)._id },
        {
          $set: {
            gameHasStarted: this.gameHasStarted
          }
        }
      );

      if (this.currentSong == null) {
        return undefined;
      }
      return { currentSong: this.currentSong, players: await this.findPlayersWithSong(this.currentSong) };
    } else {
      return undefined;   //returns undefined if game is already started.
    }
  }

  async addPlayer(username: string, topSongs: Song[]) {

    const pl: Player = { name: username, topSongs: topSongs };
    if (this.allPlayers.filter((player => player.name == username)).length > 0) {
      return undefined;
    }

    this.allPlayers.push(pl);

    //Adds player to the database
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

  async dropDB(): Promise<void> {
    await gameModel.deleteMany({ _id: { $ne: (await this.game)._id } });
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
    if (this.currentSong == null) {
      return { gameHasStarted: this.gameHasStarted, currentPlayers: this.allPlayers };
    }
    return {
      gameHasStarted: this.gameHasStarted,
      currentPlayers: await this.findPlayersWithSong(this.currentSong),
      currentSong: this.currentSong
    };
  }

  async recoverDataFromDatabase(): Promise<undefined | { allPlayers: Player[], gameHasStarted: boolean, currentSong: Song, shuffledSongs: Song[] }> {
    const [game]: any = await gameModel.find({ _id: (await this.game)._id });

    this.flushService();
    if (!game) {
      return undefined;
    }
    const recovered: { allPlayers: Player[], gameHasStarted: boolean, currentSong: Song, shuffledSongs: Song[] } = game;
    //retreives the data of players
    recovered.allPlayers.forEach(player => {
      this.allPlayers.push(player);
    });
    //retreives the data of gameHasAlreadyStarted
    this.gameHasStarted = recovered.gameHasStarted;
    //retreives the data of currentSong
    this.currentSong = recovered.currentSong;
    //retreives the data of shuffledSongs
    recovered.shuffledSongs.forEach(song => {
      this.shuffledSongs.push(song);
    });
    return recovered;
  }

  async flushService(): Promise<void> {
    //removes all players from allplayers
    this.allPlayers.forEach(() => {
      this.allPlayers.pop();
    });
    //removes all songs from shuffledsongs
    this.shuffledSongs.forEach(() => {
      this.shuffledSongs.pop();
    });
    this.gameHasStarted = false;
    this.currentSong = undefined;
  }



  async nextSong(): Promise<{ currentSong: Song; players: Player[]; } | undefined> {

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
    const uniqueSongs: Set<Song> = new Set(this.allPlayers.flatMap(player => player.topSongs));
    if (uniqueSongs.size == 0) {
      throw new Error(`The given players have no top songs.`);
    }
    return Array.from(uniqueSongs);
  }

  // Returns all players that have the given song as one of their topsongs.
  async findPlayersWithSong(currentSong: Song): Promise<Player[]> {
    //const playersWithSong: Player[] = this.allPlayers.filter(player => player.topSongs.includes(currentSong));
    const playersWithSong = this.allPlayers.filter((player) => {
      return player.topSongs.some((song) => song.id === currentSong.id);
    });
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

