import React from 'react';
import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import {PreGame} from './PreGame';

enum Page {
    PREGAME,
    PLAYGAME,
}

//const [page, setPage] = useState<Page>(Page.PREGAME);

let page: Page = Page.PREGAME;

function renderPreGame() {
    render(<PreGame goToGamePage={() => {
        //setPage(Page.PLAYGAME);
        page = Page.PLAYGAME
    }}/>);
}

//TODO: Make async so that State can be used
test('Check that pregame renders startgame button', async () => {
    renderPreGame();

    const startGameButton = screen.getByText(/Start Game/);
    expect(startGameButton).toBeInTheDocument();

    fireEvent.click(startGameButton);


    expect(page).toEqual(Page.PLAYGAME);

});

//TODO
test('Check that the start game request is only sent once', () => {

});