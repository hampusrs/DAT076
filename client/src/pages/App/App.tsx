import {useState} from 'react';
import { PreGame } from '../PreGame/PreGame';
import { PlayGame } from '../PlayGame/PlayGame';
import { Login } from '../Login/Login';
import { GameOver } from '../GameOver/GameOver';

export interface Song {
    title: string;
    album: string;
    artist: string;
    albumCoverPath: string;
}

export interface Player {
    name: string;
    topSongs: Song[];
}

enum Page {
    LOGIN,
    PREGAME,
    PLAYGAME,
    GAMEOVER
}

export function App() {

    const [page, setPage] = useState<Page>(Page.LOGIN);

    switch (page) {
        case Page.PREGAME:
            return <PreGame goToGamePage={() => {
                setPage(Page.PLAYGAME);
            }}/>
        case Page.PLAYGAME:
            return <PlayGame goToGameOverPage={() => {
                setPage(Page.GAMEOVER)
            }}/>
        case Page.LOGIN:
            return <Login goToPreGamePage={() => {
                setPage(Page.PREGAME);
            }}/>
        case Page.GAMEOVER:
            return <GameOver/>
        default:
            return <Login goToPreGamePage={() => {
                setPage(Page.PREGAME);
            }}/>
    }
}

export default App;