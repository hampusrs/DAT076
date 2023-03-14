import React from 'react';
import { render, screen } from '@testing-library/react';
import {PlayersView} from './PlayersView';

describe('PlayersView', () => {
    test('renders player name', () => {
        const playerName = 'Namn Namnsson';
        render(<PlayersView pName={playerName}/>);

        const playerNameElement = screen.getByText(playerName);
        expect(playerNameElement).toBeInTheDocument();
    });

    test('renders child elements', () => {
        const playerName = 'Namn Namnsson';
        render(
            <PlayersView pName={playerName}>
                <p>Player stats</p>
            </PlayersView>
        );

        const playerStatsElement = screen.getByText('Player stats');
        expect(playerStatsElement).toBeInTheDocument();
    });
});