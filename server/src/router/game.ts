import express, { Request, Response } from "express";
import { Song } from "../model/Song";
import { Player } from "../model/Player";
import {makeGameService } from "../service/game";
export const gameRouter = express.Router();
const gameService = makeGameService();

import querystring from 'query-string';
import dotenv from 'dotenv';
dotenv.config();

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

gameRouter.post(
  "/game",
  async (req: GameActionRequest, res: Response<string | { currentSong : Song, players : Player[] }>) => {
    try {
      const action: string = req.body.action;
      if (action == "StartGame") {
        if(gameService.startGame() == null) {
          res.status(400).send(`Game has already been started`);
        }
        res.status(200).send(await gameService.startGame());
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


gameRouter.get('/login', (req, res) => {
  const state = generateRandomString(16);
  res.cookie('spotify_auth_state', state); 

  const scope = 'user-top-read';

  const CLIENT_ID = process.env["CLIENT_ID"];
  const CLIENT_SECRET = process.env["CLIENT_SECRET"];
  const REDIRECT_URI = process.env["REDIRECT_URI"];

  /*const queryParams = querystring.stringify({
    client_id: CLIENT_ID,
    response_type: 'code',
    redirect_uri: REDIRECT_URI,
    state: state,
    scope: scope
  });*/
  res.redirect(`https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${REDIRECT_URI}`);
  //res.redirect(`https://accounts.spotify.com/authorize?${queryParams}`);

})

const generateRandomString = (length : number) => {
  let text = '';
  const possible = 'ABDDEFGHIJKLMNOPQRSTUVXYZabcdefghiijklmnopqrstuvxyz0123456789';
  for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}