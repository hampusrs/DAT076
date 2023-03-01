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
      players: Player[];
    }>("http://localhost:8080/game/started");
    setPlayers(response.data.players);
    setStatus(response.data.gameHasStarted);
  }

  // Creates a PlayerView component for given player.
  function displayPlayer(player: Player) {
    return <PlayersView pName={player.name}> </PlayersView>;
  }

  // Call getAllPlayers() every second
  function myInterval(): void {
    setInterval(() => {
      void (async () => {
        await getAllPlayers();
      })();
    }, 1000);
  }

  // then call like so
  myInterval();

  return (
    <div className="CurrentPlayers">
      <div className="PlayerTable">
        <div className="Content">
          {
            status
              ? null // send to new game window
              : players?.map(displayPlayer) //Apply displayPlayer to all players in players.
          }
        </div>
      </div>
      <button className="StartGameBtn">
        <label className="Label">Start Game</label>
      </button>
    </div>
  );
}

export default App;

/*
- display currentPlayers
    - dynamic table with all players
- continuiously checks if game has started and updates players if anyone has joined
    - while {started: false} - add players
    - while {started: true} - game has started, no more players can be added
- a button that starts the game 
*/
