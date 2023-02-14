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
    <section id="songSection">
      <img src={albumCoverPath} alt={album} />
      <ul>
        <li> {title} </li>
        <li> {artist} </li>
        <li> {album} </li>
      </ul>
    </section>
  );
}

export default SongItem;
