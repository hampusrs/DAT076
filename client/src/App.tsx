import {useState} from 'react';
import {PreGame} from './PreGame'
import PlayGame from './PlayGame';
import Login from "./Login";

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
    PLAYGAME
}

export function App() {

    const [page, setPage] = useState<Page>(Page.LOGIN);

    switch (page) {
        case Page.PREGAME:
            return <PreGame goToGamePage={() => {
                setPage(Page.PLAYGAME);
            }}/>
        case Page.PLAYGAME:
            return <PlayGame/>
        case Page.LOGIN:
            return <Login goToPreGamePage={() => {
                setPage(Page.PREGAME);
            }}/>
        default:
            return <Login goToPreGamePage={() => {
                setPage(Page.PREGAME);
            }}/>
    }
}

export default App;