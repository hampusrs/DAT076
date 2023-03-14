import React from 'react';
import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import {SongItem} from './SongItem';

test('test-template', () => {
    render(<SongItem
        title={'myTitle'}
        artist={'myArtist'}
        album={'myAlbum'}
        albumCoverURI={'myAlbumCoverURI'}
    />);

    expect(0).toEqual(0);
});

/*
test('Check that song is rendered', () => {
    render(<SongItem title="FireWorks" artist="Katy Perry" album="Teenage Dream"
                     albumCoverURI="./logo.svg"></SongItem>);
    expect(screen.getByText(/Katy Perry/)).toBeInTheDocument();
    expect(screen.getByText(/Teenage Dream/)).toBeInTheDocument();
});

test('Check that the start game request is only sent once', () => {

});
*/