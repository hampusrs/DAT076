import express, {Request, Response} from "express";
import {Song} from "../model/Song";
import {Player} from "../model/Player";
import {makeGameService} from "../service/game";

export const gameRouter = express.Router();
const gameService = makeGameService();
import dotenv from "dotenv";

dotenv.config();
import axios, {AxiosError} from "axios";

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

/*
gameRouter.get("/game", async (_, res) => {
    try {
        res.status(200).send(await gameService.isAlreadyStarted());
    } catch (e: any) {
        console.error(e.stack);
        res.status(500).send(e.message);
    }
});
*/

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
                const startGameResponse:
                    | { currentSong: Song; players: Player[] }
                    | undefined = await gameService.startGame();
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

    const scope = "user-top-read user-read-email";

    if (CLIENT_ID == null || REDIRECT_URI == null) {
        res
            .status(500)
            .send("Server error: Enviroment variables not set up correctly");
    } else {
        const queryParams = `client_id=${CLIENT_ID}&response_type=code&redirect_uri=${REDIRECT_URI}&scope=${encodeURIComponent(
            scope
        )}`;
        res.redirect(`https://accounts.spotify.com/authorize?${queryParams}`);
    }
});

gameRouter.get("/callback", async (req, res) => {
    const code = req.query["code"] || null;

    try {
        if (REDIRECT_URI == null) {
            res.status(500).redirect("http://localhost:3000");
            return;
        }
        const authResponse = await axios({
            method: "post",
            url: "https://accounts.spotify.com/api/token",
            data: `grant_type=authorization_code&code=${code}&redirect_uri=${encodeURIComponent(
                REDIRECT_URI
            )}`,
            headers: {
                "content-type": "application/x-www-form-urlencoded",
                Authorization: `Basic ${new (Buffer as any).from(
                    `${CLIENT_ID}:${CLIENT_SECRET}`
                ).toString("base64")}`,
            },
        });

        if (authResponse.status === 200) {
            // access token has been granted
            const {access_token, refresh_token, expires_in, token_type} =
                authResponse.data;

            // get user's info with access token
            const userInfoResponse = await axios.get(
                "https://api.spotify.com/v1/me",
                {
                    headers: {
                        Authorization: `${token_type} ${access_token}`,
                    },
                }
            );

            if (userInfoResponse.status === 200) {
                // get user's top tracks with access token
                const topTracksResponse = await axios.get(
                    "https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=50",
                    {
                        headers: {
                            Authorization: `${token_type} ${access_token}`,
                        },
                    }
                );

                if (topTracksResponse.status === 200) {
                    // The fetched data needed to add a player to game
                    const userinfo = userInfoResponse.data;
                    const tracks = topTracksResponse.data;

                    // user name
                    const display_name: string = userinfo.display_name;
                    let playerName: string;
                    if (display_name == null) {
                        // if display name is not found
                        playerName = "N/A"; // set default user name
                    } else {
                        playerName = display_name;
                    }

                    // top songs
                    const topSongs: Song[] = [];
                    tracks.items.map((track: any) => {
                        const song: Song = {
                            id: track.id,
                            title: track.name,
                            album: track.album.name,
                            artist: track.artists[0].name,
                            albumCoverURI: track.album.images[1].url,
                        };
                        topSongs.push(song);
                    });

                    // add player to game
                    await gameService.addPlayer(playerName, topSongs);
                    const queryParams = `access_token=${encodeURIComponent(
                        access_token
                    )}&refresh_token=${encodeURIComponent(
                        refresh_token
                    )}&expires_in=${encodeURIComponent(expires_in)}`;

                    res.status(200).redirect(`http://localhost:3000/?${queryParams}`);
                }
            }
        }
    } catch (error: AxiosError | any) {
        if (axios.isAxiosError(error)) {
            // caused by requests send to SpotifyAPI
            if (!(error.response?.status == null)) {
                res.status(error.response.status).redirect("http://localhost:3000");
            } else {
                res.status(500).redirect("http://localhost:3000");
            }
        } else {
            console.log(error.message);
            res.status(500).redirect("http://localhost:3000");
        }
    }
});

interface RevealPlayersRequest extends Request {
    body: { action: string };
}

gameRouter.get("/game/currentSong/isRevealed", async (_, res) => {
    try {
        if (gameService.gameHasStarted == false) {
          res.status(400).send("The game has not started yet");
        } else {
          res.status(200).send({playersAreRevealed: gameService.playersAreRevealed});
        }
    } catch (e: any) {
        console.error(e.stack);
        res.status(500).send(e.message);
    }
});

gameRouter.post(
    "/game/currentSong/isRevealed",
    async (
        req: RevealPlayersRequest,
        res: Response<string | { playersAreRevealed: boolean }>) => {
        try {
            const action: string = req.body.action;

            if (!gameService.gameHasStarted) {
                res.status(400).send("The game has not started yet");
            }

            if (action == "HidePlayers") {
                await gameService.hidePlayers();
                res.status(200).send();
            } else if (action == "RevealPlayers") {
                await gameService.revealPlayers();
                res.status(200).send();
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

// FOR TESTING: Manually adding a player to game without having to log into Spotify
gameRouter.post("/game/players", (req, res) => {
    const username: string = req.body.username;
    const topSongs: Song[] = req.body.topSongs;

    const addPlayerResponse = gameService.addPlayer(username, topSongs);
    if (addPlayerResponse == null) {
        res.status(400).send(`Player ${username} is already in game`);
    } else {
        res.status(200).send(`Successfully added player ${username} to the game`);
    }
});

