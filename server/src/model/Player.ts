import { Song } from "./Song";

export class Player {
    name : string;
    topSongs : Array<Song>;

    constructor(name : string, topSongs : Array<Song>) {
        this.name = name;
        this.topSongs = topSongs;
    }

}