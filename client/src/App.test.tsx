import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import {SongItem} from './components/SongItem';

test('Check that app renders next button', () => {
  render(<App />);
  const linkElement = screen.getByText(/Next Song/i);
  expect(linkElement).toBeInTheDocument();
});

test('Check that song is rendered', () => {
  render(<SongItem title="FireWorks" artist = "Katy Perry" album="Teenage Dream" albumCoverURI="./logo.svg"></SongItem>);
  expect(screen.getByText(/Katy Perry/)).toBeInTheDocument();
  expect(screen.getByText(/Teenage Dream/)).toBeInTheDocument();
});

test('Check that the start game request is only sent once', () => {
  
});

// How to test next song?