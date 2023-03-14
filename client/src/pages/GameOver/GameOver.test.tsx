import React from 'react';
import { render, screen } from '@testing-library/react';
import { GameOver } from './GameOver';

describe('GameOver', () => {
    test('renders Game Over text', () => {
        render(<GameOver/>);

        const gameoverText = screen.getByText(/GAME IS OVER/);
        expect(gameoverText).toBeInTheDocument();
    });
});