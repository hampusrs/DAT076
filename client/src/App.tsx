import React, { useEffect, useState } from 'react';
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
  const [currentSong, setCurrentSong] = useState<Song>({title : "placeholder", album: "placeholder", artist : "placeholder", albumCoverPath : "placeholder"});

  async function startGame() {
    const response = await axios.post<{currentSong : Song, players : Player[]}>("http://localhost:8080/game", { action: 'StartGame' });
    console.log(response);
  }

  async function nextSong() {
    const response = await axios.post<{currentSong : Song, players : Player[]}>("http://localhost:8080/game", { action: 'NextSong' });
    console.log(currentSong);
    setCurrentSong(response.data.currentSong);
  }

  useEffect(() => {
    startGame();
  }, []);


  return (
    <div className="App">
      <SongItem title={currentSong?.title} artist={currentSong?.artist} album={currentSong?.album} albumCoverPath="./logo192.png"> </SongItem>
      <button onClick={nextSong}>Hej</button>
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