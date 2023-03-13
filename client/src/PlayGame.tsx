import React, {useEffect, useState} from 'react';
import './PlayGame.css';
import {SongItem} from './components/SongItem';
import {PlayersView} from "./components/PlayersView"
import RevealPlayersView from "./components/RevealPlayersView"
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
    const [currentSong, setCurrentSong] = useState<Song | undefined>(undefined);

    // players that has current song as top song
    const [currentPlayers, setCurrentPlayers] = useState<Player[] | undefined>(undefined);

    // ALL players that are currently in the game
    const [players, setPlayers] = useState<Player[] | undefined>(undefined);

    // The current state of the playerView. If open is true, the playerView is shown, otherwise not.
    const [open, setOpen] = useState<boolean>(false)

    const [reset, setReset] = useState<boolean>(false); //Vad gör denna?
    const [gameHasStarted, setGameHasStarted] = useState<boolean>(false);
    const [currentPlayersAreRevealed, setCurrentPlayersAreRevealed] = useState<boolean>(false);

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
        if (!gameHasStarted) {
            const response = await axios.post<{
                currentSong: Song,
                currentPlayers: Player[]
            }>("http://localhost:8080/game", {action: 'StartGame'});
            setCurrentSong(response.data.currentSong);
            setCurrentPlayers(response.data.currentPlayers);
            setGameHasStarted(true);
        }

    }

    async function fetchGame() {
        const response = await axios.get<{
            gameHasStarted: boolean;
            currentPlayers: Player[];
            currentSong: Song;
        }>("http://localhost:8080/game/started");
        setCurrentSong(response.data.currentSong);
        setCurrentPlayers(response.data.currentPlayers);
        setGameHasStarted(response.data.gameHasStarted);
    }

    // Call getAllPlayers() every second
    useEffect(() => {
        const intervalId = setInterval(() => {
            void (async () => {
                await fetchGame();
                await playersAreRevealed();
            })();
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);


    async function nextSong() {
        await hidePlayers();
        setReset(false);
        const response = await axios.post<{
            currentSong: Song;
            currentPlayers: Player[];
        }>("http://localhost:8080/game", {action: "NextSong"});
        setCurrentSong(response.data.currentSong);
        setCurrentPlayers(response.data.currentPlayers);
    }


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

    async function playersAreRevealed() {
        const response = await axios.get<{
            playersAreRevealed: boolean;
        }>("http://localhost:8080/game/currentSong/isRevealed");
        setCurrentPlayersAreRevealed(response.data.playersAreRevealed);
    }

    async function revealPlayers() {
        const response = await axios.post<{}>("http://localhost:8080/game/currentSong/isRevealed", {action: "RevealPlayers"});
        if (response.status === 200) {
            setCurrentPlayersAreRevealed(true);
        }
        //await axios.post("http://localhost:8080/game/currentSong/isRevealed", {action: "RevealPlayers"});
    }

    async function hidePlayers() {
        const response = await axios.post<{}>("http://localhost:8080/game/currentSong/isRevealed", {action: "HidePlayers"});
        if (response.status === 200) {
            setCurrentPlayersAreRevealed(false);
        }
        //await axios.post("http://localhost:8080/game/currentSong/isRevealed", {action: "HidePlayers"});
    }

    //let players: string[] = currentPlayers?.map(getPlayerName);

    return (
        <div className="PlayGame">
            <div className="SongItem">
                {currentSong == null ? (
                    <p>No Game Right Now</p>
                ) : (
                    <SongItem
                        title={currentSong.title}
                        artist={currentSong.artist}
                        album={currentSong.album}
                        albumCoverURI={currentSong.albumCoverURI}
                    />
                )}
            </div>
            <div className="RevealItem">
                <label className="Question"> Who's top song is this? </label>
                {currentPlayersAreRevealed ?
                    <RevealPlayersView players={currentPlayers?.map(getPlayerName)}/>
                    : <button className='RevealPlayersButton GreenButton' onClick={revealPlayers}>
                        Reveal players
                    </button>}
            </div>
            <div className="next-song-div">
                <button
                    className="NextSongBtn GreenButton"
                    onClick={nextSong}>
                    Next Song
                </button>
            </div>
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
