import React, { useEffect, useState, useRef } from 'react';
import logo from './logo.svg';
import './App.css';
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

function App() {
  // currentSong is undefined if game has not yet started, otherwise current song
  const [currentSong, setCurrentSong] = useState<Song | undefined>(undefined);
  const startedGame = useRef<boolean>(false);

  useEffect(() => {
    startGame();
  }, []);

  async function startGame() {
    console.log("startedGame: " + startedGame.current);
    if (! startedGame.current){
      console.log("Starting game")
      startedGame.current = true;
      const response = await axios.post<{currentSong : Song, players : Player[]}>("http://localhost:8080/game", { action: 'StartGame' });
      setCurrentSong(response.data.currentSong);
      console.log("startedGame is now " + startedGame.current)
    }
  }

  async function nextSong() {
    const response = await axios.post<{currentSong : Song, players : Player[]}>("http://localhost:8080/game", { action: 'NextSong' });
    setCurrentSong(response.data.currentSong);
  }

  return (
    <div className="App">
      {(currentSong == null) 
      ? <p>Please wait, connecting to server</p>
      : <SongItem title={currentSong.title} artist={currentSong.artist} album={currentSong.album} albumCoverPath="./logo192.png" />}
      <button onClick={nextSong}>Next Song</button>
    </div>
  );
}

interface SongItemProps {
  title: string;
  artist: string;
  album: string;
  albumCoverPath: string;
  children?: React.ReactNode;
}

function SongItem({ title, artist, album, albumCoverPath }: SongItemProps) {
  return (
    <section id="songSection">
      <img src={albumCoverPath} alt={album} />
      <ul>
        <li> {title} </li>
        <li> {artist} </li>
        <li> {album} </li>
      </ul>
    </section>
  );
}

export default App;