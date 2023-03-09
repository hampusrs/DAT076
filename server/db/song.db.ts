import {Schema} from "mongoose";
import { Song } from "../src/model/Song";
import { conn } from "./conn";

const songSchema : Schema = new Schema({
    id : {
        type : Number,
        required : true,
        unique: true
    },
    title: {
        type : String,
        required : true,
    },
    album: {
        type : String,
        required : true,
    },
    artist: {
        type : String,
        required : true,
    },
    albumCoverURI: {
        type: String,
        required : true,
    }
})

export const songModel = conn.model<Song>("Songs", songSchema);
