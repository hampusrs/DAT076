import {Schema, Model} from "mongoose";
import { Player } from "../src/model/Player";
import { Song } from "../src/model/Song";
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
        required: false,
    },
    shuffledSongs: {
        type: [songModel],
        required: false,
    }

})

export const gameModel = conn.model<any>("game", gameSchema);  //Har ingen aning om vad som ska vara inom <>!?!?! any låter kanske konstigt men vad annars?