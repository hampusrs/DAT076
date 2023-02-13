import { Song } from "../model/Song";

export interface Player {
    name : string;
    topSongs : Song[];
}