import React, {useEffect, useState, useRef} from 'react';
import './PlayGame.css';
import {SongItem} from './components/SongItem';
import {PlayersView} from "./components/PlayersView"
import RevealPlayersCard from "./components/RevealPlayersCard"
import axios from 'axios';


interface Song {
    title: string;
    album: string;
    artist: string;
    albumCoverURI: string;
}

interface Player {
    name: string;
    topSongs: Song[];
}

export function PlayGame() {
    // currentSong is undefined if game has not yet started, otherwise current song
    //const [currentSong, setCurrentSong] = useState<Song | undefined>(undefined);
    const currentSong = useRef<Song | undefined>(undefined);
    // players that has current song as top song
    //const [currentPlayers, setCurrentPlayers] = useState<Player[] | undefined>(undefined);
    const currentPlayers = useRef<Player[] | undefined>(undefined);
    // ALL players that are currently in the game
    const [players, setPlayers] = useState<Player[] | undefined>(undefined);
    // The current state of the playerView. If open is true, the playerView is shown, otherwise not.
    const [open, setOpen] = useState<boolean>(false)

    //const [players, setPlayers] = useState<Player[] | undefined>(undefined);
    //const [reset, setReset] = useState<boolean>(false)
    //const startedGame = useRef<boolean>(false);
    //const [players, setPlayers] = useState<Player[] | undefined>(undefined);
    const [reset, setReset] = useState<boolean>(false); //Vad gör denna?
    //const gameHasStarted = useRef<boolean>(false);
    const [gameHasStarted, setGameHasStarted] = useState<boolean>(false);

    /**
     * Gets all players that are currently playing the game.
     * Updates players accordingly.
     */
    async function getPlayers() {
        // request the games players, GET request and set players to the response
        const response = await axios.get<{ players: Player[] }>("http://localhost:8080/game");
        setPlayers(response.data.players);
    }

    useEffect(() => {
        startGame();
    }, [])

    async function startGame() {
        /*if (!startedGame.current) {
            startedGame.current = true;
            const response = await axios.post<{
                currentSong: Song,
                players: Player[]
            }>("http://localhost:8080/game", {action: 'StartGame'});
            setCurrentSong(response.data.currentSong);
            setCurrentPlayers(response.data.players);
        } else {
            nextSong();
        }*/
        /*
              const response = await axios.get<{
                  gameHasStarted: boolean;
              }>("http://localhost:8080/game/started");
              //gameHasStarted.current = (response.data.gameHasStarted);
              setGameHasStarted(response.data.gameHasStarted);
        */


        if (!gameHasStarted) {
            const response = await axios.post<{
                currentSong: Song,
                players: Player[]
            }>("http://localhost:8080/game", {action: 'StartGame'});
            currentSong.current = (response.data.currentSong);
            currentPlayers.current = (response.data.players);
            //gameHasStarted.current = true;
            setGameHasStarted(true);
        }


    }

    async function fetchGame() {
        const response = await axios.get<{
            gameHasStarted: boolean;
            currentPlayers: Player[];
            currentSong: Song;
        }>("http://localhost:8080/game/started");
        currentSong.current = (response.data.currentSong);
        currentPlayers.current = (response.data.currentPlayers);
        setGameHasStarted(response.data.gameHasStarted);
    }

    // Call getAllPlayers() every second
    useEffect(() => {
        const intervalId = setInterval(() => {
            void (async () => {
                await fetchGame();
                console.log(currentSong);
            })();
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);

    /*
      async function nextSong() {
        setReset(false);
        const response = await axios.post<{
          currentSong: Song;
          currentPlayers: Player[];
        }>("http://localhost:8080/game", { action: "NextSong" });
        currentSong.current = (response.data.currentSong);
        currentPlayers.current = (response.data.currentPlayers);
      }*/


    // Creates a PlayerView component for given player.
    function displayPlayer(player: Player) {
        return <PlayersView pName={player.name}> </PlayersView>;
    }

    /**
     * Since onClick for showPlayersButton has to execute two methods we
     * put the both here and then only calls one method in the onClick. */
    function showPlayerButtonAction() {
        getPlayers();
        setOpen(!open);
    }

    function getPlayerName(player: Player): string {
        if (player == null) {
            return "";
        }
        return player.name
    }


    //let players: string[] = currentPlayers?.map(getPlayerName);

    return (
            <div className="PlayGame">
                <div className="SongItem">
                    {currentSong == null ? (
                            <p>No Game Right Now</p>
                            ) : (
                                    <SongItem
                                        title={currentSong.current?.title}
                                        artist={currentSong.current?.artist}
                                        album={currentSong.current?.album}
                                        albumCoverURI={currentSong.current?.albumCoverURI}
                                    />
                                    )}
                </div>
                <div className="RevealItem">
                    <label className="Question"> Who's top song is this? </label>
                    <RevealPlayersCard players={currentPlayers.current?.map(getPlayerName)} />
                </div>
                <button
                    className="NextSongBtn GreenButton"
                    onClick={() => {
                    console.log("albumPath: " + currentSong.current?.albumCoverURI);
                    console.log(currentSong);
                }}
                    >
                    Next Song
                </button>
                <div className="showAllPlayersDiv">
                    <button
                        className="showPlayersButton GreenButton"
                        onClick={showPlayerButtonAction}
                        >
                        Show all players
                    </button>
                    <div className="playersList">
                        {/* If open is true then display all players otherwise display nothing. */}
                        {open
            ? players?.map(displayPlayer) //Apply displayPlayer to all players in players.
            : null}
                    </div>
                </div>
            </div>
            );
}

export default PlayGame;
