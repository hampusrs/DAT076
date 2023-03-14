import React, { useEffect, useState, useRef } from "react";
import "./PreGame.css";
import "./components/PlayersView";
import PlayersView from "./components/PlayersView";
import { Player } from "./App";
import { Song } from "./App";
import axios from "axios";


  export function PreGame(props : {
    goToGamePage : () => void
  }) {
    const [players, setPlayers] = useState<Player[] | undefined>(undefined);
    //const [status, setStatus] = useState<boolean>(false);
    const [gameHasStarted, setGameHasStarted] = useState<boolean>(false)
    /**
     * Gets all players that are currently playing the game.
     * Updates players accordingly.
     */
    async function getGameStatus(): Promise<void> {
      // request the games players, GET request and set players to the response
      const response = await axios.get<{
        gameHasStarted: boolean;
        currentPlayers: Player[];
        //currentSong: Song;
      }>("http://localhost:8080/game/started");
      setPlayers(response.data.currentPlayers);
      //setCurrentSong(response.data.currentSong);
      setGameHasStarted(response.data.gameHasStarted);
     }

      // Call getAllPlayers() every second
      useEffect(() => {
          const intervalId = setInterval(() => {
              void (async () => {
                  await getGameStatus();
              })();
          }, 1000);

          return () => clearInterval(intervalId);
      }, []);

      useEffect(() => {
          if (gameHasStarted) {
              props.goToGamePage();
          }
      }, [gameHasStarted]);
    
  
    // Creates a PlayerView component for given player.
    function displayPlayer(player: Player) {
      return <PlayersView pName={player.name}> </PlayersView>;
    }
  
    
    return (
      <div className="CurrentPlayers">
        <div className="PlayerTable">
          <div className="Content">
            {gameHasStarted ? null : players?.map(displayPlayer)}
          </div>
        </div>
        <button className="StartGameBtn" onClick={e => {
          e.preventDefault();
          props.goToGamePage();
        }}>
          <label className="StartGameLabel">Start Game</label>
        </button>
      </div>
    );
  }
  
  export default PreGame;