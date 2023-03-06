const song1 = {
    id: 1,
    title: "Firework",
    album: "Teenage Dream",
    artist: "Katy Perry",
};
const song2 = {
    id: 2,
    title: "Baby",
    album: "My Worlds",
    artist: "Justin Bieber",
};
const song3 = {
    id: 3,
    title: "Levels",
    album: "True",
    artist: "Avicii",
};
let currentSong;
const player1 = { name: "Bob", topSongs: [song1, song2] };
const player2 = { name: "Jane", topSongs: [song2, song3] };
const players = [player1, player2];
class GameService {
    async getPlayers() {
        return { players: players };
    }
    async startGame() {
        if (currentSong == null) {
            return this.randomizeNewCurrentSong();
        }
        else {
            return undefined; //returns undefined if game is already started.
        }
    }
    async nextSong() {
        if (currentSong == null) {
            throw new Error(`Game has not started yet`);
        }
        else {
            return this.randomizeNewCurrentSong();
        }
    }
    async findSongs() {
        const uniqueSongs = new Set(players.flatMap(player => player.topSongs));
        return Array.from(uniqueSongs);
    }
    async findPlayersWithSong(currentSong) {
        return players.filter(player => player.topSongs.includes(currentSong));
    }
    async randomizeNewCurrentSong() {
        //find a song;
        const uniqueSongs = this.findSongs();
        const randIndex = Math.floor(Math.random() * (await uniqueSongs).length);
        const newSong = (await uniqueSongs)[randIndex];
        if (newSong == null) {
            throw new Error(`No song with index ${randIndex}`); // check that index is within bounds
        }
        //find all players with that song
        const playersWithSong = this.findPlayersWithSong(newSong);
        // set currentSong to the new song
        currentSong = newSong;
        return { currentSong: currentSong, players: (await playersWithSong) };
    }
}
export function makeGameService() {
    return new GameService();
}
//# sourceMappingURL=game.js.map