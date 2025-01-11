import { useState, useEffect } from 'react';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import '../styles/RecommendedSongs.css';

interface RecommendedSongsProps {
  recommendations: string[];
  accessToken: string;
}

const RecommendedSongs: React.FC<RecommendedSongsProps> = ({ recommendations, accessToken }) => {
  const [newRec, setNewRec] = useState<(string | any[])[]>([]);
  const getFeatures = async (title: string, artist: string) => {
    const searchParams = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + accessToken
      }
    }
    try{
      const searchQuery = encodeURIComponent(`${title} artist:${artist}`);
      const result = await fetch(`https://api.spotify.com/v1/search?q=${searchQuery}&type=track&limit=1&market=KR`, searchParams);
      const data = await result.json();
      const album = data.tracks.items[0].album.name || title;
      const album_pic = data.tracks.items[0].album.images[0].url;
      const spotify_url = data.tracks.items[0].external_urls.spotify;
      return [album, album_pic, spotify_url];
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    const updateRecommendations = async () => {
      const updatedRecommendations = await Promise.all(
        recommendations.map(async (recommendation) => {
          const features = await getFeatures(recommendation[0], recommendation[1]);
          return features ? [...recommendation, ...features] : recommendation; // Add features to recommendation
        })
      );
      setNewRec(updatedRecommendations); // Update state with new array
    };

    updateRecommendations();
  }, [recommendations]);


  return (
    <div className="playlist-container">
      <div className="playlist-header">
        <div className="header-number">#</div>
        <div className="header-album-pic"></div>
        <div className="header-title">Title</div>
        <div className="header-artist">Artist</div>
        <div className="header-duration">Album</div>
        <div className="header-external-link"></div>
      </div>
      {/* Recommendation Array */}
      {/* [title, artist, album, album_pic, spotify_url] */}
      <div className="playlist-tracks">
        {newRec.map((recommendation, index) => (
          <div className="track-row" key={index}>
            <div className="track-number">{index + 1}</div>
            <div className="track-album-pic"><img src={recommendation[3]} alt="album" /></div>
            <div className="track-title">{recommendation[0]}</div>
            <div className="track-artist">{recommendation[1]}</div>
            <div className="track-duration">{recommendation[2]}</div>
            <div className="track-external-link">
              <a href={recommendation[4]} target="_blank" rel="noopener noreferrer">
                <ArrowOutwardIcon sx={{ color: '#a0aec0' }} />
              </a>
            </div>
          </div>
        ))}
      </div>
   </div>
  )
}

export default RecommendedSongs;