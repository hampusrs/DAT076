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

        const loginButton = screen.getByRole('button', {name: /Log in w\/ Spotify/i});
        expect(loginButton).toBeInTheDocument();
    });
});

/*
describe('Login button', () => {

    test('redirects to spotify login', () => {
        renderLogin();

        const loginButton = screen.getByRole('button', {name: /Log in w\/ Spotify/i});
        fireEvent.click(loginButton);

        //TODO
        //expect(window.location.href).toBe('http://localhost:8080/login');
        //expect(mockedAxios.get).toHaveBeenCalledWith("http://localhost:8080/login");
    });


    test('calls "goToPreGamePage" prop when access token is set', () => {
        renderLogin()

        //TODO
        //expect(0).toEqual(1);
    });


});
*/

