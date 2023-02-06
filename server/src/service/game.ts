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

export const gameID: number = 123;

export async function getGame(): Promise<Player[]> {
  return players;
}

export async function startGame(): Promise<[Song, Player[]]> {
  if (currentSong == null) {
    //find a song;
    //find all players with that song
    // set currentSong to the new song
    currentSong = song1;
    return [currentSong, [player1]]; // <- change this later
  } else {
    throw new Error(`Game has already started`);
  }
}

export async function nextSong(): Promise<[Song, Player[]]> {
  if (currentSong == null) {
    throw new Error(`Game has not started yet`);
  } else {
    // find new song
    // find players who have that song
    // return song and the list of players
    currentSong = song2;
    return [currentSong, [player1, player2]]; // <- change this later
  }
}
