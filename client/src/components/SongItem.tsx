interface SongItemProps {
  title: string;
  artist: string;
  album: string;
  albumCoverPath: string;
  children?: React.ReactNode;
}

export function SongItem({
  title,
  artist,
  album,
  albumCoverPath,
}: SongItemProps) {
  return (
    <section className="DisplaySong">
      <img className="AlbumCover" src={albumCoverPath} alt={album} />
      <ul className="SongInfo">
        <li className="SongTitle"> {title} </li>
        <li className="ArtistName"> {artist} </li>
        <li className="AlbumTitle"> {album} </li>
      </ul>
    </section>
  );
}

export default SongItem;
