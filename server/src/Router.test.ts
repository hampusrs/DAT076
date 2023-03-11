import * as SuperTest from "supertest";
import { app } from "./index";
const request = SuperTest.default(app);
import { Song } from "./model/Song";

const song1: Song = {
  id: 1,
  title: "Firework",
  album: "Teenage Dream",
  artist: "Katy Perry",
  albumCoverURI: "",
};
const song2: Song = {
  id: 2,
  title: "Baby",
  album: "My Worlds",
  artist: "Justin Bieber",
  albumCoverURI: "",
};
const song3: Song = {
  id: 3,
  title: "Levels",
  album: "True",
  artist: "Avicii",
  albumCoverURI: "",
};

beforeAll(async () => {
  try {
    // Add two players to the game
    await request
      .post("/game/players")
      .send({ username: "Bob", topSongs: [song1, song2] });
    await request
      .post("/game/players")
      .send({ username: "Jane", topSongs: [song2, song3] });
  } catch (error) {
    console.error(error);
    fail("Failed to set up test data.");
  }
});

describe("Before game has started", () => {
  describe("GET to /game/started", () => {
    test("Should respond with 200 status code", async () => {
      const response = await request.get("/game/started");
      expect(response.statusCode).toBe(200);
    });
    test("Should return body with gameHasStarted = false and currentPlayers, not currentSong", async () => {
      const response = await request.get("/game/started");
      expect(response.body.gameHasStarted).toBe(false);
      expect(response.body.currentPlayers).toBeDefined;
      expect(response.body.currentSong).toBeUndefined;
    })
  });
  describe("POST to /game", () => {
    describe("Given a body with action 'NextSong'", () => {
      test("Should give error code 400 and error message", async () => {
        const response = await request
          .post("/game")
          .send({ action: "NextSong" });
        expect(response.statusCode).toBe(400);
        expect(response.text).toBe(
          "Game has not started yet or no songs left in queue"
        );
      });
    });
    describe("Given a body with action 'StartGame'", () => {
      test("Should respond with 200 status code and body with currentSong and players", async () => {
        const response = await request
          .post("/game")
          .send({ action: "StartGame" });
        expect(response.statusCode).toBe(200);
        expect(response.body.currentSong).toBeDefined();
        expect(response.body.players).toBeDefined();
      });
    });
  });
});

describe("When game has started", () => {
  describe("POST to /game", () => {
    describe('Given a body  with action "StartGame"', () => {
      test("Should give error code 400 and error message if game has already started", async () => {
        const response = await request
          .post("/game")
          .send({ action: "StartGame" });
        expect(response.statusCode).toBe(400);
        expect(response.text).toBe(
          "Game has already started or game has no songs"
        );
      });
    });
    describe('Given a body with action "NextSong"', () => {
      test("Should respond with 200 status code and body with currentSong and players", async () => {
        const response = await request
          .post("/game")
          .send({ action: "NextSong" });
        expect(response.statusCode).toBe(200);
        expect(response.body.currentSong).toBeDefined();
        expect(response.body.players).toBeDefined();
      });
    });
    describe("Given a body with invalid action", () => {
      test("Should respond with 400 status code and error message", async () => {
        const response = await request
          .post("/game")
          .send({ action: "Invalid action" });
        expect(response.statusCode).toBe(400);
        expect(response.text).toBe(
          "The action 'Invalid action' is not defined"
        );
      });
    });
  });
  describe("GET to /game/started", () => {
    test("Should respond with 200 status code", async () => {
      const response = await request.get("/game/started");
      expect(response.statusCode).toBe(200);
    })
    test("Should return body with gameHasStarted = true, currentPlayers and currentSong", async () => {
      const response = await request.get("/game/started");
      expect(response.body.gameHasStarted).toBe(true);
      expect(response.body.currentPlayers).toBeDefined;
      expect(response.body.currentSong).toBeDefined;
    })
  });
});



/*
test("(/game) Post request with action start game sets a currentSong", async () => {
  // send start game
  // check currentSong is not undefined
});

test("(/game) Post request with action start game sets gameHasStarted to true", async () => {});

test("End-to-end test", async () => {
  const res1 = await request.get("/game");
  expect(res1.statusCode).toEqual(200);
  const res2 = await request.post("/game").send({ action: "StartGame" });
  expect(res2.statusCode).toEqual(200);
  console.log(res2.body);
  expect(res2.body.currentSong).not.toBeNull();
});
*/
