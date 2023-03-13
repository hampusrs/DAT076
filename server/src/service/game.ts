import {Song} from "../model/Song";
import {Player} from "../model/Player";

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

    async revealPlayers(): Promise<{playersAreRevealed: boolean}> {
        this.playersAreRevealed = true;
        return {playersAreRevealed: this.playersAreRevealed};
    }

    async hidePlayers(): Promise<{playersAreRevealed: boolean}> {
        this.playersAreRevealed = false;
        return {playersAreRevealed: this.playersAreRevealed};
    }

    //Gets all players
    async getPlayers(): Promise<{ players: Player[] }> {
        return {players: this.allPlayers};
    }


    async startGame(): Promise<{ currentSong: Song, players: Player[] } | undefined> {
        if (this.gameHasStarted == true) {
            return undefined;
        }
        if (this.currentSong == null) {
            await this.setupSongs();
            this.currentSong = this.shuffledSongs.at(this.shuffledSongs.length - 1); //Pick first song in shuffledSongs.
            if (this.currentSong == null) {
                return undefined;
            }
            this.gameHasStarted = true;
            return {currentSong: this.currentSong, players: await this.findPlayersWithSong(this.currentSong)}
        } else {
            return undefined;   //returns undefined if game is already started.
        }
    }


    /**
     async startGame(): Promise<{ currentSong: Song, players: Player[] } | undefined> {
    await this.setupSongs();
    this.gameHasStarted = true;
    //this.currentSong = this.shuffledSongs.at(this.shuffledSongs.length - 1); //Pick first song in shuffledSongs.
    return await this.nextSong();
  }
     */

    async addPlayer(username: string, topSongs: Song[]) {
        const p: Player = {name: username, topSongs: topSongs};
        if (this.allPlayers.filter((player => player.name == username)).length > 0) {
            return undefined;
        }
        this.allPlayers.push(p);
        return p;
    }

    private async setupSongs(): Promise<void> {
        //Gets all the songs.
        const uniqueSongs: Promise<Song[]> = this.findSongs();
        //Gets shuffled array of all songs.
        this.shuffledSongs = await this.shuffleSongs(uniqueSongs);
    }

    async isAlreadyStarted(): Promise<{ gameHasStarted: boolean, currentPlayers: Player[], currentSong?: Song }> {
        if (this.currentSong == null) {
            return {gameHasStarted: this.gameHasStarted, currentPlayers: this.allPlayers};
        }
        return {
            gameHasStarted: this.gameHasStarted,
            currentPlayers: await this.findPlayersWithSong(this.currentSong),
            currentSong: this.currentSong
        };
    }


    async nextSong(): Promise<{ currentSong: Song; players: Player[]; } | undefined> {
        if (this.currentSong == null) {
            return undefined;
        } else {
            this.currentSong = this.shuffledSongs.pop();
            if (this.currentSong == null) {
                return undefined;
            }
            return {currentSong: this.currentSong, players: await this.findPlayersWithSong(this.currentSong)}
        }
    }

    /**
     async nextSong(): Promise<{ currentSong: Song; players: Player[]; } | undefined> {
      this.currentSong = this.shuffledSongs.pop();
      if (this.currentSong == null) {
        return undefined;
      }
      return {currentSong : this.currentSong , players : await this.findPlayersWithSong(this.currentSong)}

  }
     */


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
