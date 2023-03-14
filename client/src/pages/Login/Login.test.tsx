import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Login } from './Login';

enum Page {
    LOGIN,
    PREGAME,
}

//const [page, setPage] = useState<Page>(Page.PREGAME);
//TODO: Make async so that State can be used
let page: Page = Page.LOGIN;

function renderLogin() {
    render(<Login goToPreGamePage={() => {
        //setPage(Page.PLAYGAME);
        page = Page.PREGAME
    }}/>);
}

test('test-template', () => {
    renderLogin();

    expect(0).toEqual(0);
});
