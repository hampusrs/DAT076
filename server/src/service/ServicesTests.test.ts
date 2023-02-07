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
})

