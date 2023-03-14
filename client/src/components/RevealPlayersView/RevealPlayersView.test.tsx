import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { RevealPlayersView } from './RevealPlayersView';

test('test-template', () => {
    render(<RevealPlayersView players={['Namn Namnsson', 'Name Smith', 'Loreen']}/>);

    expect(0).toEqual(0);
});
