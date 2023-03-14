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

test('test-template', () => {
    renderPlayGame();

    expect(0).toEqual(0);
});

//TODO: How to test next song?