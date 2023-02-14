import React, { useEffect, useState, useRef } from 'react';
import logo from './logo.svg';
import './App.css';
import {SongItem} from './components/SongItem';

import axios from 'axios';

export interface Song {
  title: string;
  album: string;
  artist: string;
  albumCoverPath : string;
}

export interface Player {
  name : string;
  topSongs : Song[];
}

export function App() {
  // currentSong is undefined if game has not yet started, otherwise current song
  const [currentSong, setCurrentSong] = useState<Song | undefined>(undefined);
  // players that has current song as top song
  const [currentPlayers, setCurrentPlayers] = useState<Player[] | undefined>(undefined);
  // ALL players that are currently in the game
  const [players, setPlayers] = useState<Player[] | undefined>(undefined); 
  const startedGame = useRef<boolean>(false);

  useEffect(() => {
    startGame();
  }, []);

  async function getPlayers() {
    // request the games players, GET request and set players to the response
    const response = await axios.get<{players : Player[]}>("http://localhost:8080/game");
    setPlayers(response.data.players);
  }

  async function startGame() {
    if (! startedGame.current){
      startedGame.current = true;
      const response = await axios.post<{currentSong : Song, players : Player[]}>("http://localhost:8080/game", { action: 'StartGame' });
      setCurrentSong(response.data.currentSong);
      setCurrentPlayers(response.data.players);
    } else {
      nextSong();
    }
  }

  async function nextSong() {
    const response = await axios.post<{currentSong : Song, players : Player[]}>("http://localhost:8080/game", { action: 'NextSong' });
    setCurrentSong(response.data.currentSong);
    setCurrentPlayers(response.data.players);
  }
  
  return (
    <div className="App">
      {(currentSong == null) 
      ? <p>No Game Right Now</p>
      : <SongItem title={currentSong.title} artist={currentSong.artist} album={currentSong.album} albumCoverPath="./logo192.png" />}
      <label> Who has this song as one of their top song? </label>
      <button onClick={nextSong}>Next Song</button>
      <aside> 
        <button id="showPlayersButton">
          Show All Players
        </button>
      </aside>
    </div>
  );
}

export default App; 