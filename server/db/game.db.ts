import {Schema, Model} from "mongoose";
import { conn } from "./conn";
import { playerModel } from "./player.db";
import { songModel } from "./song.db";

const gameSchema : Schema = new Schema({
    allPlayers: {
        type: [ playerModel ],  //ska de vara playermodel, playerSchema eller bara array<Player>
        required: true,
    },
    gameHasStarted: {
        type: Boolean,
        required: true,
    },
    currentSong: {
        type: songModel,
        required: true,
    },
    shuffledSongs: {
        type: [songModel],
        required: true,
    }

})

export const gameModel = conn.model("Game", gameSchema);  //con.model<????>