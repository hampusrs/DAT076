import express, { Request, Response, Router } from "express";
import { Song } from "../model/Song";
import { Player } from "../model/Player"
import { startGame, nextSong , gameID} from "../service/game";
//POST to /game with body { "action" : "start" } Responds with { currentSong : ..., currentPlayer : ...}, error response if game has already started.
//POST to /game with body { "action" : "next song" } Responds with { currentSong: ..., currentPlayers: ...}, error response if game has not started.
//POST to /game with body { "action" : "end game"} Responds with 200 empty body if game has started, error response if game has not started.
export const gameRouter = express.Router();

interface GameActionRequest extends Request {
    body : {action : string}
}

gameRouter.post("/game", async (req : GameActionRequest, res : Response <string | [Song, Player[]]>) => {
    try {
        const action : string = req.body.action;
        if (action == "StartGame") {
            res.status(200).send(await startGame())
        } else if (action == "NextSong") {
            res.status(200).send(await nextSong());
        } else {
            res.status(400).send(`The action ${action} is not defined`);
        }
    } catch (e : any) {
        console.error(e.stack);
        res.status(500).send(e.message);
    }
    
})

