import express, { Request, Response } from "express";
import { Song } from "../model/Song";
import { Player } from "../model/Player";
import {makeGameService } from "../service/game";
export const gameRouter = express.Router();
const gameService = makeGameService();
import queryString from 'query-string';
import dotenv from 'dotenv';
dotenv.config();
import axios from 'axios';

const CLIENT_ID = process.env["CLIENT_ID"];
const CLIENT_SECRET = process.env["CLIENT_SECRET"];
const REDIRECT_URI = process.env["REDIRECT_URI"];

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


gameRouter.get('/login', (_, res) => {
  const state = generateRandomString(16);
  res.cookie('spotify_auth_state', state); 

  const scope = 'user-top-read';

  const queryParams = queryString.stringify({
    client_id: CLIENT_ID,
    response_type: 'code',
    redirect_uri: REDIRECT_URI,
    state: state,
    scope: scope
  });
  //res.redirect(`https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${REDIRECT_URI}`);
  res.redirect(`https://accounts.spotify.com/authorize?${queryParams}`);

})

gameRouter.get('/callback', (req,res) => {
  const code = req.query["code"] || null;
  
  axios({
    method: 'post',
        url: 'https://accounts.spotify.com/api/token',
        data: queryString.stringify({
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: REDIRECT_URI
        }),
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${new (Buffer as any).from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`
        },
  }).then(response => {
    if (response.status === 200) {
      // request spotify data
      const {access_token, token_type} = response.data;

      axios.get('https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=5', {
        headers: {
          Authorization: `${token_type} ${access_token}`
        }
      }).then(response => {
        console.log(response.data);
        res.send(`<pre>${JSON.stringify(response.data, null,2)}</pre>`) // response!
      })
    }
  }).catch(error => { // response was not sucessful, no authorization code
    res.send(error);
  })

})

const generateRandomString = (length : number) => {
  let text = '';
  const possible = 'ABDDEFGHIJKLMNOPQRSTUVXYZabcdefghiijklmnopqrstuvxyz0123456789';
  for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}