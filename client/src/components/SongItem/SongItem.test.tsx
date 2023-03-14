import React from 'react';
import {render, screen} from '@testing-library/react';
import {SongItem} from './SongItem';

describe('SongItem', () => {
    const mySong = {
        title: 'myTitle',
        artist: 'myArtist',
        album: 'myAlbum',
        albumCoverURI: 'myAlbumCoverURI',
    };

    test('renders song title', () => {
        render(<SongItem
            title={mySong.title}
            artist={mySong.artist}
            album={mySong.album}
            albumCoverURI={mySong.albumCoverURI}
        />);

        const songTitleElement = screen.getByText(mySong.title);
        expect(songTitleElement).toBeInTheDocument();
    });

    test('renders artist name', () => {
        render(<SongItem
            title={mySong.title}
            artist={mySong.artist}
            album={mySong.album}
            albumCoverURI={mySong.albumCoverURI}
        />);

        const songArtistElement = screen.getByText(mySong.artist);
        expect(songArtistElement).toBeInTheDocument();
    });

    test('renders album title', () => {
        render(<SongItem
            title={mySong.title}
            artist={mySong.artist}
            album={mySong.album}
            albumCoverURI={mySong.albumCoverURI}
        />);

        const songAlbumElement = screen.getByText(mySong.album);
        expect(songAlbumElement).toBeInTheDocument();
    });
    
});
