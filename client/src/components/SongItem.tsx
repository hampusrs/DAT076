interface SongItemProps {
  title: string;
  artist: string;
  album: string;
  albumCoverURI: string;
  children?: React.ReactNode;
}

export function SongItem({
  title,
  artist,
  album,
  albumCoverURI,
}: SongItemProps) {
  return (
    <section className="DisplaySong">
      <img className="AlbumCover" src={albumCoverURI} alt={album} />
      <ul className="SongInfo">
        <li className="SongTitle"> {title} </li>
        <li className="ArtistName"> {artist} </li>
        <li className="AlbumTitle"> {album} </li>
      </ul>
    </section>
  );
}

export default SongItem;
