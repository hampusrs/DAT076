import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { PlayGame } from './PlayGame';


enum Page {
    PLAYGAME,
    GAMEOVER,
}

//const [page, setPage] = useState<Page>(Page.PREGAME);
//TODO: Make async so that State can be used
let page: Page = Page.PLAYGAME;

function renderPlayGame() {
    render(<PlayGame goToGameOverPage={() => {
        //setPage(Page.GAMEOVER);
        page = Page.GAMEOVER
    }}/>);
}

describe('PlayGame', () => {
    test('renders Next Song button', () => {
        renderPlayGame();

        const nextSongButton = screen.getByRole('button', {name: /Next Song/});
        expect(nextSongButton).toBeInTheDocument();
    });

    test('renders Reveal Players button', () => {
        renderPlayGame();

        const revealPlayersButton = screen.getByRole('button', {name: /Reveal players/});
        expect(revealPlayersButton).toBeInTheDocument();
    });

    test('renders Current Players button', () => {
        renderPlayGame();

        const currentPlayersButton = screen.getByRole('button', {name: /Current players/});
        expect(currentPlayersButton).toBeInTheDocument();
    });
});
