interface RevealPlayersProps {
    //TODO: Remove undefined
    players: string[] | undefined;
    children?: React.ReactNode;
}

export function RevealPlayersView({players}: RevealPlayersProps) {
    function PlayerParser(players: string[] | undefined): string {
        if (players == null) {
            return "";
        }
        let parsedString = "";
        players.forEach((player, index) => {
            parsedString += player;
            if (index !== players.length - 1) {
                parsedString += ", ";
            }
        });
        return parsedString;
    }


    return (
        <div className="reveal-players-view">
            <h1>{PlayerParser(players)}</h1>
        </div>
    );
}

export default RevealPlayersView;

