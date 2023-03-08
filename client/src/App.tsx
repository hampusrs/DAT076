import {useState} from 'react';
import {PreGame} from './PreGame'
import PlayGame from './PlayGame';

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
};

export function App() {

    const [page, setPage] = useState<Page>(Page.PREGAME);

    switch(page) {
        case Page.PREGAME:
            return <PreGame goToGamePage={() => {
                setPage(Page.PLAYGAME);
            }}/>
        case Page.PLAYGAME:
            return <PlayGame/>
        default: 
            return <PreGame goToGamePage={() => {
                setPage(Page.PLAYGAME);
            }}/>
    }
}

export default App;