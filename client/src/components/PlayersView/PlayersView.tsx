interface PlayerViewProps {
    pName : string;
    children ?: React.ReactNode;
}

export function PlayersView ({pName}: PlayerViewProps) {
    return (
        <div className="playerView"> {pName} </div> 
    );
}

export default PlayersView;