import express, { Request, Response } from "express";
import { Song } from "../model/Song";
import { Player } from "../model/Player";
import { makeGameService } from "../service/game";
export const gameRouter = express.Router();
const gameService = makeGameService();
import queryString from "query-string";
import dotenv from "dotenv";
dotenv.config();
import axios from "axios";

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
  async (
    req: GameActionRequest,
    res: Response<string | { currentSong: Song; players: Player[] }>
  ) => {
    try {
      const action: string = req.body.action;
      if (action == "StartGame") {
        if (gameService.startGame() == null) {
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

gameRouter.get("/login", (_, res) => {
  const state = generateRandomString(16);
  res.cookie("spotify_auth_state", state);

  const scope = "user-top-read user-read-email";

  const queryParams = queryString.stringify({
    client_id: CLIENT_ID,
    response_type: "code",
    redirect_uri: REDIRECT_URI,
    state: state,
    scope: scope,
  });
  res.redirect(`https://accounts.spotify.com/authorize?${queryParams}`);
});

// TODO: Better response handling
gameRouter.get("/callback", async (req, res) => {
  const code = req.query["code"] || null;

  try {
    const authResponse = await axios({
      method: "post",
      url: "https://accounts.spotify.com/api/token",
      data: queryString.stringify({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: REDIRECT_URI,
      }),
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${new (Buffer as any).from(
          `${CLIENT_ID}:${CLIENT_SECRET}`
        ).toString("base64")}`,
      },
    });

    if (authResponse.status === 200) {
      // access token has been granted
      const { access_token, token_type } = authResponse.data;

      // Get user's info
      const userInfoResponse = await axios.get("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: `${token_type} ${access_token}`,
        },
      }); 
      // 401 (bad/expired token), 403 (bad oAuth req), 429

      // Get user's top tracks
      const topTracksResponse = await axios.get(
        "https://api.spotify.com/v1/me/top/tracks?limit=20",
        {
          headers: {
            Authorization: `${token_type} ${access_token}`,
          },
        }
      );
      
      // The fetched data needed to create a player object
      const userinfo = userInfoResponse.data;
      const tracks = topTracksResponse.data;

      // Get the revelant data from the responses
      // user name
      const username : string = userinfo.id;
      const display_name : string = userinfo.display_name;
      let playerName : string;
      if (display_name == null) { // if display name is not found
        playerName = username;   // set player's name to only username
      } else {
        playerName = `${display_name} (${username})`;
      }
      
      // top songs
      const topSongs: Song[] = [];
      tracks.items.map((track: any) => {
        //const albumCover : string = track.album.images[0];
        const song: Song = {
          id: track.id,
          title: track.name,
          album: track.album.name,
          artist: track.artists[0].name,
        };
        topSongs.push(song);
      });

      const newPlayer : Player = {name : playerName, topSongs : topSongs}
      //gameService.addPlayer(player_name, topSongs) // TODO: fix when addPlayer has been implemented in gameService
      res.send(JSON.stringify(newPlayer,null,2));
    }
  } catch (error) {
    res.send(error);
  }
});

const generateRandomString = (length: number) => {
  let text = "";
  const possible =
    "ABDDEFGHIJKLMNOPQRSTUVXYZabcdefghiijklmnopqrstuvxyz0123456789";
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};
