import {Schema, Model} from "mongoose";
import { Player } from "../src/model/Player";
import { Song } from "../src/model/Song";
import { conn } from "./conn";

const playerSchema : Schema = new Schema({
    name : {
        type : String,
        required: true
    },
    topSongs : {
        type: Array<Song>,
        required: true
    }
})

export const playerModel = conn.model<Player>("Players", playerSchema);
