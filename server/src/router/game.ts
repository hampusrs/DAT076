import express, { Request, Response } from "express";
import { Song } from "../model/Song";
import { Player } from "../model/Player";
import {makeGameService } from "../service/game";
import { ResolveOptions } from "dns";
//POST to /game with body { "action" : "start" } Responds with { currentSong : ..., currentPlayer : ...}, error response if game has already started.
//POST to /game with body { "action" : "next song" } Responds with { currentSong: ..., currentPlayers: ...}, error response if game has not started.
//POST to /game with body { "action" : "end game"} Responds with 200 empty body if game has started, error response if game has not started.
export const gameRouter = express.Router();
const gameService = makeGameService();

gameRouter.get("/game", async (_, res) => {
  try {
    res.status(200).send(await gameService.getPlayers());
  } catch (e: any) {
    console.error(e.stack);
    res.status(500).send(e.message);
  }
});

interface GameActionRequest extends Request {
  body: { action: string };
}

gameRouter.get("/game/started", async (_, res: Response<{ gameHasStarted: boolean, currentPlayers: Player[], currentSong?: Song}>) => {
  try{
    res.status(200).send(await gameService.isAlreadyStarted());
  }catch (e: any){
    console.error(e.stack);
    res.status(400).send(e.message);
  }
});

gameRouter.post(
  "/game",
  async (req: GameActionRequest, res: Response<string | { currentSong : Song, players : Player[] }>) => {
    try {
      const action: string = req.body.action;
      if (action == "StartGame") {
        const startGameResponse : { currentSong: Song, players: Player[] } | undefined = await gameService.startGame()
        if(startGameResponse == null) {
          res.status(400).send(`Game has already been started`);
        }
        res.status(200).send(startGameResponse);
      } else if (action == "NextSong") {
          res.status(200).send(await gameService.nextSong());
      } else {
        res.status(400).send(`The action ${action} is not defined`);
      }
    } catch (e: any) {
      console.error(e.stack);
      res.status(500).send(e.message);
    }
  }
);
