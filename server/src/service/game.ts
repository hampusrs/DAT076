import { Song } from "../model/Song";
import { Player } from "../model/Player";
// import { playerModel } from "../../db/player.db";
import { gameModel } from "../../db/game.db";
// import { songModel } from "../../db/song.db";

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

      await this.dropDB();
      await this.setupSongs(); //updates this.shuffledSongs
      this.currentSong = this.shuffledSongs.pop();    //this.shuffledSongs.at(this.shuffledSongs.length - 1);

      if (this.game == null) {
        throw new Error(`Game is null`);
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
      return undefined;   //returns undefined if game is already started.
    }
  }

  async addPlayer(username: string, topSongs: Song[]) {

    const pl: Player = { name: username, topSongs: topSongs };
    if (this.allPlayers.filter((player => player.name == username)).length > 0) {
      return undefined;
    }

    this.allPlayers.push(pl);

    // for the database
    // creates a new player p with the given username and topsongs and saves it to the db.

    // const p = await playerModel.create({
    //   name: username,
    //   topSongs: topSongs
    // })
    // await p.save();

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
    return { gameHasStarted: this.gameHasStarted, currentPlayers: this.allPlayers, currentSong: this.currentSong };
  }

  async recoverDataFromDatabase(): Promise<undefined | { allPlayers: Player[], gameHasStarted: boolean, currentSong: Song, shuffledSongs: Song[] }> {
    const [game]: any = await gameModel.find({ _id: (await this.game)._id });

    console.log(this.allPlayers + `   pre allplayers \n\n`);
    console.log(this.currentSong + `    pre currentSong \n\n`);
    console.log(this.shuffledSongs + `     pre shuffledsongs \n\n`);
    console.log(this.gameHasStarted + `   pre gamehasstarted \n\n`);

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

    console.log(this.allPlayers + `   post allplayers \n\n`);
    console.log(this.currentSong + `    post currentSong \n\n`);
    console.log(this.shuffledSongs + `     post shuffledsongs \n\n`);
    console.log(this.gameHasStarted + `   post gamehasstarted \n\n`);
    // console.log(JSON.stringify(recovered.allPlayers.pop()) + `        pop \n \n`);
    // if(recovered.allPlayers != null) console.log(JSON.stringify(recovered.allPlayers) + `  allPlayers is undefined \n\n`);
    // if(recovered.gameHasStarted != null) console.log(JSON.stringify(recovered.gameHasStarted) + `  gameHasStarted is undefined \n\n`);
    // if(recovered.currentSong != null) console.log(JSON.stringify(recovered.currentSong) + `  currentSong is undefined \n\n`);
    // if(recovered.shuffledSongs != null) console.log(JSON.stringify(recovered.shuffledSongs) + `  shuffledSongs is undefined \n\n`);
    return recovered;
  }

  async flushService(): Promise<void> {
    //removes all players from allplayers
    this.allPlayers.forEach(() => {
      this.allPlayers.pop();
    });
    this.shuffledSongs.forEach(() => {
      this.shuffledSongs.pop();
    });

    this.gameHasStarted = false;
    this.currentSong = undefined;

    console.log(this.allPlayers + `   afterflush allplayers \n\n`);
    console.log(this.currentSong + `    afterflush currentSong \n\n`);
    console.log(this.shuffledSongs + `     afterflush shuffledsongs \n\n`);
    console.log(this.gameHasStarted + `   afterflush gamehasstarted \n\n`);

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

    const playersWithSong: Player[] = [];
    for (const player of this.allPlayers) {
      if (player.topSongs && player.topSongs.includes(currentSong)) { // added a check for player.topSongs
        playersWithSong.push(player);
      }
    }
    return playersWithSong;

    // const playersWithSong: Player[] = this.allPlayers.filter(player => player.topSongs.includes(currentSong));
    // if (playersWithSong.length == 0) {
    //   throw new Error(`No player have this song as one of their top songs.`);
    // }
    // return playersWithSong;
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

