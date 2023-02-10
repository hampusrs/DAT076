import { makeGameService } from "./game";

test("Test that the array of current players in the game have length 2", async () => {
    const gameService = makeGameService();
    const players = gameService.getGame();
    expect((await players).length).toEqual(2);
});

test("Test if the first player is named Bob", async () => {
    const gameService = makeGameService();
    const players = gameService.getGame();
    expect((await players)[0].name).toEqual("Bob");
});

test("Check if the list of songs does not contain duplicates", async () => { 
    const gameService = makeGameService();
    const songs = gameService.findSongs();
    expect((await songs).length).toEqual(3);
});

test("Check if song is not in list of top songs for a chosen player", async () => {
    const gameService = makeGameService();
    const currentSong = (await gameService.findSongs())[2]
    const players = gameService.findPlayersWithSong(currentSong);
    const playerNames : string[] = []; 
    (await players).forEach(player => {
        playerNames.push(player.name);
    });
    expect(playerNames.includes("Bob")).toBeFalsy();
});


test("Find player that has currentSong as top song", async () => {
    const gameService = makeGameService();
    const currentSong = (await gameService.findSongs())[0]
    const players = gameService.findPlayersWithSong(currentSong);
    const playerNames : string[] = new Array<string>();
    (await players).forEach(player => {
        playerNames.push(player.name);
    });
    expect(playerNames.includes("Bob")).toBeTruthy();
   
});

