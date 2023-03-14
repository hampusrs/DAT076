import axios, { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { Song } from '../App/App';
import './GameOver.css';

export function GameOver() {
    return (
        <div className="GameOver">
            <label className='GameOverLabel'>GAME IS OVER</label>
        </div>
      );
}
export default GameOver;