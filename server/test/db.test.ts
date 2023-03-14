import { gameModel } from "../schema/game.db"

beforeEach(async () => gameModel.collection.drop());

describe("Adding a game to database", () => {
    it("should make the database have length 1", async () => {
        await gameModel.create({
            allPlayers: [{ name: "Bob", topSongs: [] }],
            gameHasStarted: false,
            currentSong: undefined,
            shuffledSongs: []
        });
        const games = await gameModel.find();
        expect(games.length).toEqual(1);
    });
});

describe("Can find a song by its id", () => {
    it("should return a game", async () => {
        const game = await gameModel.create({
            allPlayers: [{ name: "Bob", topSongs: [] }],
            gameHasStarted: false,
            currentSong: undefined,
            shuffledSongs: []
        });
        const retrievedGame = await gameModel.findById(game._id);
        expect(retrievedGame).not.toBeNull();
    });
});

it("Should update the properties of a game", async () => {
    const game = await gameModel.create({
        allPlayers: [{ name: "Bob", topSongs: [] }],
        gameHasStarted: false,
        currentSong: undefined,
        shuffledSongs: []
    });
    const newProps = {
        gameHasStarted: true,
        currentSong: "Song 1",
    };
    await gameModel.findByIdAndUpdate(game._id, newProps);
    const updatedGame = await gameModel.findById(game._id);
    if (updatedGame == null) {
        throw new Error(`updatedGame is null`);
    }
    expect(updatedGame.gameHasStarted).toBe(true);
    expect(updatedGame.currentSong[0][0]).toEqual("Song 1");
});

it("should delete a game", async () => {
    const game = await gameModel.create({
        allPlayers: [{ name: "Bob", topSongs: [] }],
        gameHasStarted: false,
        currentSong: undefined,
        shuffledSongs: []
    });
    await gameModel.findByIdAndDelete(game._id);
    const deletedGame = await gameModel.findById(game._id);
    expect(deletedGame).toBeNull();
});

it("should retrieve all games", async () => {
    await gameModel.create({
      allPlayers: [{name: "Bob", topSongs: []}],
      gameHasStarted: false,
      currentSong: undefined,
      shuffledSongs: []
    });
    await gameModel.create({
      allPlayers: [{name: "Alice", topSongs: []}],
      gameHasStarted: true,
      currentSong: "Song 1",
      shuffledSongs: ["Song 2", "Song 3"]
    });
    const games = await gameModel.find();
    expect(games.length).toBe(2);
  });

  it("should retrieve games with a specific property value", async () => {
    await gameModel.create({
      allPlayers: [{name: "Bob", topSongs: []}],
      gameHasStarted: false,
      currentSong: undefined,
      shuffledSongs: []
    });
    await gameModel.create({
      allPlayers: [{name: "Alice", topSongs: []}],
      gameHasStarted: true,
      currentSong: "Song 1",
      shuffledSongs: ["Song 2", "Song 3"]
    });
    const startedGames = await gameModel.find({ gameHasStarted: true });
    expect(startedGames.length).toBe(1);
    if (startedGames[0] == null) {
        throw new Error(`startedGames is null`);
    }
    expect(startedGames[0].currentSong[0][0]).toEqual("Song 1");
  });

  
