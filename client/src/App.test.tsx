import React from 'react';
import { render, screen } from '@testing-library/react';
import App, {SongItem} from './App';

test('Check that app renders next button', () => {
  render(<App />);
  const linkElement = screen.getByText(/Next Song/i);
  expect(linkElement).toBeInTheDocument();
});

test('Check that song is rendered', () => {
  render(<SongItem title="FireWorks" artist = "Katy Perry" album="Teenage Dream" albumCoverPath="./logo.svg"></SongItem>);
  expect(screen.getByText(/Katy Perry/)).toBeInTheDocument();
  expect(screen.getByText(/Teenage Dream/)).toBeInTheDocument();
});
