import React from 'react';
import { render, screen } from '@testing-library/react';
import { RevealPlayersView } from './RevealPlayersView';

describe('RevealPlayersView', () => {
    /*
    test('renders no players when players prop is undefined', () => {
        render(<RevealPlayersView players={undefined}/>);

        const noPlayersElement = screen.getByText('');
        expect(noPlayersElement).toBeInTheDocument();
    });
    */

    /*
    test('renders no players when players prop is null', () => {
        render(<RevealPlayersView players={null} />);

        const noPlayersElement = screen.getByText('');
        expect(noPlayersElement).toBeInTheDocument();
    });
    */

    test('renders comma-separated list of players when players prop is provided', () => {
        const players = ['Namn Namnsson', 'Name Smith', 'Loreen'];
        render(<RevealPlayersView players={players}/>);

        const playersListElement = screen.getByText('Namn Namnsson, Name Smith, Loreen');
        expect(playersListElement).toBeInTheDocument();
    });

    /*
    test('renders custom child elements', () => {
        const players = ['Namn Namnsson', 'Name Smith', 'Loreen'];
        render(
            <RevealPlayersView players={players}>
                <p>Player stats</p>
            </RevealPlayersView>
        );

        const playerStatsElement = screen.getByText('Player stats');
        expect(playerStatsElement).toBeInTheDocument();
    });
    */
});
