import React, { useState } from 'react';
import {forEach} from "react-bootstrap/ElementChildren";

interface RevealPlayersCardProps {
  players: string[] | undefined;
  children?: React.ReactNode;
}

function RevealPlayersCard({ players }: RevealPlayersCardProps) {
  const [showPlayers, setShowPlayers] = useState(false);

  const handleTextboxClick = () => {
    setShowPlayers(true);
  };

  function PlayerParser(players: string[] | undefined): string {
      if (players == null) {
          return "";
      }
    let parsedString = "";
      players.forEach((player, index) => {
          parsedString += player;
          if (index !== players.length - 1) {
              parsedString += ", ";
          }
      });
      return parsedString;
  }
    

  return (
          <div className="flip-card">
              <div className="flip-card-inner">
                  <div className="flip-card-front">
                      <h1>Hover to Reveal</h1>
                      </div>
                  <div className="flip-card-back">
                      <h1>{PlayerParser(players)}</h1>
                  </div>
                  </div>
              </div>
  );
}

export default RevealPlayersCard;
