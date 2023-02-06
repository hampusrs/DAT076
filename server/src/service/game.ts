import { Game } from "../model/Game";
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
const song3: Song = { id: 2, title: "Levels", album: "True", artist: "Avicii" };
let currentSong: Song | undefined;

const player1: Player = { name: "Bob", topSongs: [song1, song2] };
const player2: Player = { name: "Jane", topSongs: [song2, song3] };
const players: Player[] = [player1, player2];

export function startGame() {
  if (currentSong == null) {
    //find a song;
    //find all players with that song;
    return [song1, [player1]]; // <- change this later
  } else {
    throw new Error(`Game has already started`);
  }
}

export function nextSong() {
  if (currentSong == null) {
    throw new Error(`Game has not started yet`);
  } else {
    // find new song
    // find players who have that song
    // return song and the list of players
    return [song2, [player1, player2]]; // <- change this later
  }
}

/*
export interface IGameService {

}

export class GameService implements IGameService {

}
const games: Array<Game> = [];

export function startNewGame(gameID: number, players: Player[], songs: Song[]) {
    const newGame = new Game(gameID, players, songs);
    games.push(newGame);
    return newGame;
}

export function addPlayer(gameID: number, name: string, topSongs: Song[]) {
    const game: Game | undefined = games.find((game: Game) => {
        return game.gameID === gameID;
    });

    if (game == null) {
        return false;
    }

    let player: Player = {name: name, topSongs: topSongs};

    game.players.push(player);
    return true;
}

export function getGames() : Game[] {
    return games;
}

export function getGame(gameID : number) {
    const game: Game | undefined = games.find((game: Game) => {
        return game.gameID === gameID;
    });

    if (game == null) {
        return false;
    }

    return game;
}


export function addGame(gameID: number, players : Player[], songs : Song[]) : Game {
    const newGame = new Game(gameID, players, songs);
    games.push(newGame);
    return newGame;
}*/
