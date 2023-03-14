import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { PlayersView } from './PlayersView';

test('test-template', () => {
    render(<PlayersView pName={'Namn Namnsson'}/>);

    expect(0).toEqual(0);
});
