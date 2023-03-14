import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { GameOver } from './GameOver';

test('Check that app renders Game Over text', () => {
    render(<GameOver/>);

    const gameoverText = screen.getByText(/GAME IS OVER/);
    expect(gameoverText).toBeInTheDocument();
});
