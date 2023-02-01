import express from "express";
import { startNewGame, addPlayer, getGames, addGame, getGame } from "../service/game";
//POST to /game with body { "action" : "start" } Responds with { currentSong : ..., currentPlayer : ...}, error response if game has already started.
//POST to /game with body { "action" : "next song" } Responds with { currentSong: ..., currentPlayers: ...}, error response if game has not started.
//POST to /game with body { "action" : "end game"} Responds with 200 empty body if game has started, error response if game has not started.
export const gameRouter = express.Router();

// Create a game
gameRouter.post("/game", (req, res) => {
    const gameID = req.body.gameID;
    const players = req.body.players;
    const songs = req.body.songs;

    const newGame = startNewGame(gameID, players, songs);
    res.status(200).send(newGame);
})

// Get all games
gameRouter.get("/game", (req, res) => {
    res.status(200).send(getGames())
})

// Get a game with a certain gameID
gameRouter.get("/game/:gameID", (req, res) => {
    const gameID : number = parseInt(req.params.gameID, 10); 
    res.status(200).send(getGame(gameID));
})

// Add a player to a game with a certain gameID
gameRouter.post("/game/:gameID/players", (req, res) => {
    const gameID : number = parseInt(req.params.gameID, 10);
    const name = req.body.name;
    const topSongs = req.body.topSongs;

    addPlayer(gameID, name, topSongs);

    res.status(200).send(getGame(gameID));
})

