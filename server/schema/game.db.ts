import {Schema} from "mongoose";
import { conn } from "./conn";
import { playerModel } from "./player.db";
import { songModel } from "./song.db";



const gameSchema : Schema = new Schema({
    allPlayers: {
        type: [{type : Array, ref: playerModel}],
        required: true,
    },
    gameHasStarted: {
        type: Boolean,
        required: true,
    },
    currentSong: {
        type: [{type: Array, ref: songModel}],  //{id: Number, title: String, artist: String, album: String, albumCoverURI: String}
        required: true, 
    },
    shuffledSongs: {
        type: [{type: Array, ref: songModel}],
        required: true,
    }

})

export const gameModel = conn.model("Game", gameSchema);