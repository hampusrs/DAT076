import express, { Request, Response } from "express";
import { Song } from "../model/Song";
import { Player } from "../model/Player";
import { makeGameService } from "../service/game";
export const gameRouter = express.Router();
const gameService = makeGameService();
import queryString from "query-string";
import dotenv from "dotenv";
dotenv.config();
import axios, { AxiosError } from "axios";

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

// Checks if game has already started
gameRouter.get(
  "/game/started",
  async (
    _,
    res: Response<{
      gameHasStarted: boolean;
      currentPlayers: Player[];
      currentSong?: Song;
    }>
  ) => {
    try {
      res.status(200).send(await gameService.isAlreadyStarted());
    } catch (e: any) {
      console.error(e.stack);
      res.status(500).send(e.message);
    }
  }
);

// Request needs to contain body with 'action'.
gameRouter.post(
  "/game",
  async (
    req: GameActionRequest,
    res: Response<string | { currentSong: Song; players: Player[] }>
  ) => {
    try {
      const action: string = req.body.action;
      if (action == "StartGame") {
        const startGameResponse: { currentSong: Song; players: Player[] } | undefined = await gameService.startGame();
        if (startGameResponse == null) {
          res.status(400).send(`Game has already started or game has no songs`); // TODO: Separate the two cases
        }
        res.status(200).send(startGameResponse);
      } else if (action == "NextSong") {
        const nextSongResponse:
          | { currentSong: Song; players: Player[] }
          | undefined = await gameService.nextSong();
        if (nextSongResponse == null) {
          res
            .status(400)
            .send("Game has not started yet or no songs left in queue"); // TODO: Separate the two cases
        }
        res.status(200).send(nextSongResponse);
      } else {
        res.status(400).send(`The action '${action}' is not defined`);
      }
    } catch (e: any) {
      // Catches possible errors from GameService
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
      // access token has been granted from Spotify
      const { access_token, token_type } = authResponse.data;
      // get user's info with access token
      const userInfoResponse = await axios.get(
        "https://api.spotify.com/v1/me",
        {
          headers: {
            Authorization: `${token_type} ${access_token}`,
          },
        }
      );
      // 200, 400, 401 (bad/expired token), 403 (bad oAuth req), 429 (exceeded # of requests)

      // sucessfully fetched user info from Spotify
      if (userInfoResponse.status === 200) {
        // get user's top tracks with access token
        const topTracksResponse = await axios.get(
          "https://api.spotify.com/v1/me/top/tracks?limit=20",
          {
            headers: {
              Authorization: `${token_type} ${access_token}`,
            },
          }
        );

        // Sucessfully fetched user's top tracks from Spotify
        if (topTracksResponse.status === 200) {
          // The fetched data needed to add a player to game
          const userinfo = userInfoResponse.data;
          const tracks = topTracksResponse.data;

          // user name
          const username: string = userinfo.id;
          const display_name: string = userinfo.display_name;
          let playerName: string;
          if (display_name == null) {
            // if display name is not found
            playerName = username; // set player's name to only username
          } else {
            playerName = `${display_name} (${username})`;
          }

          // top songs
          const topSongs: Song[] = [];
          tracks.items.map((track: any) => {
            const song: Song = {
              id: track.id,
              title: track.name,
              album: track.album.name,
              artist: track.artists[0].name,
              albumCoverURI: track.album.images[1],
            };
            topSongs.push(song);
          });

          // add player to game
          const addPlayerResponse: Player | undefined =
            await gameService.addPlayer(playerName, topSongs);
          if (addPlayerResponse == null) {
            res.status(400).send(`Player ${playerName} is already in the game`);
          } else {
            // Player was added to game
            // only send the players' names (to avoid revealing the player's top songs in the frontend)
            const allPlayersNames: String[] = gameService.allPlayers.map(
              (player) => player.name
            );
            // redirect to frontend, and send all players in query
            res.status(200).redirect(
              `http://localhost:3000?${queryString.stringify({
                allPlayers: JSON.stringify(allPlayersNames),
              })}`
            );
          }
        }
      }
    }
  } catch (error: AxiosError | any) {
    if (axios.isAxiosError(error)) {
      if (!(error.response?.status == null)) {
        if (error.response?.status === 403) {
          // Could be because user is not added in Spotify App dashboard
          res
            .status(error.response?.status)
            .send(
              `Cannot fetch user data, expired access token or user has not allowed access`
            );
        } else {
          res
            .status(error.response?.status)
            .send(
              `Axios error with status code ${error.response?.status}, ${error.response?.statusText}, Bad request to Spotify API`
            );
        }
      } else {
        res.send(error).status(500);
      }
    }
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
