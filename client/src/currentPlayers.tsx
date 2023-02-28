import React, {useEffect, useState, useRef} from 'react';
import './currentPlayers.css';


export function App() {



    return (
        <div className="CurrentPlayers">
            <div className='PlayerTable'>
            <div className='Content'>

            </div>
            </div>
            <button className='StartGameBtn'>
                <label className='Label'>
                    Start Game
                </label>
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