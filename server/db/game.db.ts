import {Schema} from "mongoose";
import { conn } from "./conn";
import { playerModel } from "./player.db";
import { songModel } from "./song.db";



const gameSchema : Schema = new Schema({
    allPlayers: {
        type: [{type : Array, ref: playerModel}],  //ska de vara playermodel, playerSchema eller bara array<Player>
        required: true,
    },
    gameHasStarted: {
        type: Boolean,
        required: true,
    },
    currentSong: {
        type: {type: String, ref: songModel},
        required: false,                         //TODO ska vara true? men då klagar server :(
    },
    shuffledSongs: {
        type: [{type: Array, ref: songModel}],
        required: true,
    }

})

export const gameModel = conn.model("Game", gameSchema);  //con.model<????>