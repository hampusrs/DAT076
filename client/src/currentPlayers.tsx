import React, { useEffect, useState, useRef } from "react";
import "./currentPlayers.css";
import "./components/PlayersView";
import PlayersView from "./components/PlayersView";
import { Player } from "./App";
import axios from "axios";


  export function App() {
    const [players, setPlayers] = useState<Player[] | undefined>(undefined);
    const [status, setStatus] = useState<boolean>(false);
  
    /**
     * Gets all players that are currently playing the game.
     * Updates players accordingly.
     */
    async function getAllPlayers(): Promise<void> {
      // request the games players, GET request and set players to the response
      const response = await axios.get<{
        gameHasStarted: boolean;
        currentPlayers: Player[];
      }>("http://localhost:8080/game/started");
      console.log(response.data.currentPlayers)
      setPlayers(response.data.currentPlayers);
      setStatus(response.data.gameHasStarted);
    }
  
    // Call getAllPlayers() every second
    useEffect(() => {
      const intervalId = setInterval(() => {
        void (async () => {
          await getAllPlayers();
        })();
      }, 1000);
  
      return () => clearInterval(intervalId);
    }, []);
  
    // Creates a PlayerView component for given player.
    function displayPlayer(player: Player) {
      return <PlayersView pName={player.name}> </PlayersView>;
    }
  
    return (
      <div className="CurrentPlayers">
        <div className="PlayerTable">
          <div className="Content">
            {status ? null : players?.map(displayPlayer)}
          </div>
        </div>
        <button className="StartGameBtn">
          <label className="Label">Start Game</label>
        </button>
      </div>
    );
  }
  
  export default App;