import React from 'react';
import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import {Login} from './Login';

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

describe('Login', () => {

    test('renders login button', () => {
        renderLogin();

        const loginButton = screen.getByRole('button', {name: /Log in/});
        expect(loginButton).toBeInTheDocument();
    });
});

