import {Game} from "../model/Game";
import {Song} from "../model/Song";
import {Player} from "../model/Player"

const games: Game[] = [];

export function startNewGame(gameID: number, players: Player[], songs: Song[]) {
    const newGame = new Game(gameID, players, songs);
    games.push(newGame);
    return newGame;
}

export function addPlayer(gameID: number, name: string, topSongs: Song[]) {
    const game: Game | undefined = games.find((game: Game) => {
        return game.gameID === gameID;
    });

    if (game == null) {
        return false;
    }

    let player: Player = {name: name, topSongs: topSongs};

    game.players.push(player);
    return true;
}
