export class Song {
    name: string;
    album: string;
    artist: string;
    albumCover: string;

    constructor(name: string, album: string, artist: string, albumCover: string) {
        this.name = name;
        this.album = album;
        this.artist = artist;
        this.albumCover = albumCover;
    }
}