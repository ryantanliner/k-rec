import { useState, useEffect } from 'react';
import '../styles/SongCard.css';



// Define props for SongCard component
interface SongCardProps {
  type: string;
  name: string;
  artist: string;
  accessToken: string;
}

//Display selected song's details and album cover
const SongCard = ({ type, name, artist, accessToken }: SongCardProps) => {
  const [imageUrl, setImageUrl] = useState('');
  const [spotifyURL, setSpotifyURL] = useState('');

  async function searchSongPicture(name: string, artist: string) {
    var searchParams = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + accessToken
      }
    }
    const searchQuery = encodeURIComponent(`${name} artist:${artist}`);

    try {
      const result = await fetch(`https://api.spotify.com/v1/search?q=${searchQuery}&type=track&limit=1&market=KR`, searchParams);
      const data = await result.json();
      console.log(data);
      setImageUrl(data.tracks.items[0].album.images[0].url);
      setSpotifyURL(data.tracks.items[0].external_urls.spotify);

    } catch (error) {
      console.error(error);
      setImageUrl('');
    }

    
  }

  useEffect(() => {
    searchSongPicture(name, artist);
  }, [name, artist]);

  return (
    <div className="selected-song">
      <h2>{type}</h2>
      <div className="selected-song-content">
        <a href={spotifyURL} target="_blank" rel="noopener noreferrer">
          <img 
            src={imageUrl} 
            alt="Album Cover"
            className="selected-song-image"
          />
        </a>
        <div className="selected-song-title">{name}</div>
        <div className="selected-song-artist">{artist}</div>
      </div>
    </div>
  );
};

export default SongCard;