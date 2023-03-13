import { makeGameService } from "./game";
import { Song } from "../model/Song";
import { Player } from "../model/Player";

/** Create mock-data, bob and jane */
const song1: Song = {
  id: 1,
  title: "Firework",
  album: "Teenage Dream",
  artist: "Katy Perry",
  albumCoverURI: ""
};
const song2: Song = {
  id: 2,
  title: "Baby",
  album: "My Worlds",
  artist: "Justin Bieber",
  albumCoverURI: ""
};
const song3: Song = {
  id: 3,
  title: "Levels",
  album: "True",
  artist: "Avicii",
  albumCoverURI: ""
};

const player1: Player = { name: "Bob", topSongs: [song1, song2] };
const player2: Player = { name: "Jane", topSongs: [song2, song3] };
// const players: Player[] = [player1, player2];

test("Test that addPlayer adds a player to currentPlayers", () => {
  
  const gameService = makeGameService();
  // add bob to game
  gameService.addPlayer(player1.name, [song1, song2]);
  // check that currentPlayers contains bob
  const numberMatches = gameService.allPlayers.filter(player => player.name == player1.name)
  expect(numberMatches.length).toBeGreaterThanOrEqual(1); 
});


test("Test that startGame returns undefined when game has already started", async () => {
  const gameService = makeGameService();
  // start the game for the first time
  await gameService.addPlayer(player1.name, player1.topSongs);
  await gameService.addPlayer(player2.name, player2.topSongs);
  expect(await gameService.startGame()).not.toBeUndefined;
  // starts the game for a second time, should return undefined.
  expect(await gameService.startGame()).toBeUndefined;
});


test("Check that startGame sets a currentSong", async () => {
  const gameService = makeGameService();
  // starts a game
  gameService.addPlayer(player1.name, player1.topSongs);
  gameService.addPlayer(player2.name, player2.topSongs);
  
  await gameService.startGame();

  expect(gameService.currentSong).not.toBeUndefined;
});


test("Checks that isAlreadyStarted returns true if game is started otherwise not.", async () => {
    const gameService = makeGameService();
    gameService.addPlayer(player1.name, player1.topSongs);
    gameService.addPlayer(player2.name, player2.topSongs);
    expect((await gameService.isAlreadyStarted()).gameHasStarted).toBeFalsy;
    gameService.startGame();
    expect((await gameService.isAlreadyStarted()).gameHasStarted).toBeTruthy;
  });

  
test("Check that startGame returns the currentSong and accurate list of players that has that song as top song", async () => {
    const gameService = makeGameService();
    gameService.addPlayer(player1.name, player1.topSongs);
    gameService.addPlayer(player2.name, player2.topSongs);
    const result = await gameService.startGame();
    expect(result).not.toBeUndefined;
    if (result == null) {
        return;
    }
    const song = result.currentSong;
    const playersWithSong = result.players;
    //Checks so that the players returned by the game are the same as the players returned by function "findPlayersWithSong"
    expect(playersWithSong.length).toEqual((await gameService.findPlayersWithSong(song)).length); 
});

test("Checks if findPlayersWithSong gives the correct players with that top song",async () => {
    const gameService = makeGameService();
    gameService.addPlayer(player1.name, player1.topSongs);
    gameService.addPlayer(player2.name, player2.topSongs);
    expect((await gameService.findPlayersWithSong(song1)).length).toEqual(1);
    expect((await gameService.findPlayersWithSong(song2)).length).toEqual(2);
    expect((await gameService.findPlayersWithSong(song3)).length).toEqual(1);
})

test("Test so adding one player doesn't return undefined but adding the same player again should",async () => {
    const gameService = makeGameService();
    expect(await gameService.addPlayer(player1.name, player1.topSongs)).not.toEqual(undefined);
    expect(await gameService.addPlayer(player1.name, player1.topSongs)).toEqual(undefined);
})

test("Check that nextSong doesn't give the same song again.", async () => {
    const gameService = makeGameService();
    gameService.addPlayer(player1.name, player1.topSongs);
    gameService.addPlayer(player2.name, player2.topSongs);
    await gameService.startGame();
    const firstSong = gameService.currentSong;
    const secondSong = gameService.nextSong();
    expect(firstSong).not.toEqual(secondSong);
    

  });

  
test("Test that the array of current players in the game have length 2", async () => {
    const gameService = makeGameService();
    gameService.addPlayer(player1.name, player1.topSongs);
    gameService.addPlayer(player2.name, player2.topSongs);
    const players = (await gameService.getPlayers()).players;
    expect(players.length).toEqual(2);
});


test("Test if the first player is named Bob", async () => {
    const gameService = makeGameService();
    gameService.addPlayer(player1.name, player1.topSongs);
    gameService.addPlayer(player2.name, player2.topSongs);
    if(gameService.allPlayers[0] == undefined) {
      return;
    }
    const name = gameService.allPlayers[0].name;
    expect(name).toEqual("Bob");
});


test("Check if the list of songs does not contain duplicates", async () => { 
    const gameService = makeGameService();
    gameService.addPlayer(player1.name, player1.topSongs)
    gameService.addPlayer(player2.name, player2.topSongs);
    const songs = gameService.findSongs();
    expect((await songs).length).toEqual(3);
});


test("Find player that has currentSong as top song", async () => {
    const gameService = makeGameService();
    gameService.addPlayer(player1.name, player1.topSongs)
    gameService.addPlayer(player2.name, player2.topSongs);
    gameService.currentSong = song1;
    const playersWithSong = await gameService.findPlayersWithSong(gameService.currentSong);
    const playersWithNameBob = playersWithSong.filter(player => player.name == "Bob")
    expect(playersWithNameBob.length).toEqual(1);
   
});