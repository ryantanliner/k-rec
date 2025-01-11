import { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import SongCard from '../components/SongCard';
import TraitsSelector from '../components/TraitsSelector';
import RecommendedSongs from '../components/RecommendedSongs';
import Papa from 'papaparse';
import '../styles/Main.css';


//Define Song object
interface Song {
  title: string;
  artist: string;
}


const CLIENT_ID = import.meta.env.VITE_CLIENT_ID || '';
const CLIENT_SECRET = import.meta.env.VITE_CLIENT_SECRET || '';



const Main = () => {
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [accessToken, setAccessToken] = useState('');
  // const [imageUrl, setImageUrl] = useState<string>('');
  const [selectedTraits, setSelectedTraits] = useState<string[]>(['danceability', 'energy', 'key']);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [data, setData] = useState<Song[]>([]);


  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/data')
      .then(response => response.text()) // Fetch the CSV data as text
      .then(csvData => {
        // Parse CSV data using PapaParse
        Papa.parse(csvData, {
          delimiter: ',', // Comma delimiter
          skipEmptyLines: true, // Skip empty lines
          complete: (result) => {
            // Type assertion: result.data is an array of string[]
            const parsedData: Song[] = (result.data as string[][]).map((row: string[]) => ({
              title: row[1], // Song name is in the second column
              artist: row[2] // Artist name is in the third column
            }));
            setData(parsedData); // Update the state with parsed data
          },
          error: (error: any) => {
            console.error('Error parsing CSV:', error.message);
          }
        });
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);



  // Fetch access token from Spotify API
  useEffect(() => {
    var authParams = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET
    }
    fetch('https://accounts.spotify.com/api/token', authParams)
      .then(result => result.json())
      .then(data => setAccessToken(data.access_token))
      .catch(error => console.error(error));
  }, []);

  // Handle song search
  const handleSongSearch = async (song: Song) => {
    setSelectedSong(song);
    await getRecommendations(song, selectedTraits);
  };
    

  async function getRecommendations(song: Song, traits: string[]) {
    console.log(song.title)
    console.log(traits)
    const params = new URLSearchParams({
      song: JSON.stringify(song.title),
      traits: JSON.stringify(traits),
    });

    fetch(`http://127.0.0.1:5000/recommendations?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => setRecommendations(data.recommendations))
      .catch((error) => console.error(error));
  }



  return (
    <div className="app-container">
      <div className="content-container">
        <h1 className="app-title">Find Similar K-Pop Songs</h1>
        <div className="search-container-wrapper">
          <div className="search-traits-container">
            <SearchBar
              handleSongSearch={handleSongSearch}
              songs={data}
            />
            <TraitsSelector
              selectedTraits={selectedTraits}
              handleTraitsChange={setSelectedTraits}
            />
          </div>
        </div>
        
        {selectedSong && (
          <>
            <SongCard 
              name={selectedSong.title}
              artist={selectedSong.artist}
              type={"Selected Song"}
              accessToken={accessToken}
            />
          </>
        )}

      </div>
      {selectedSong && (
        <>
          <RecommendedSongs recommendations={recommendations} accessToken={accessToken} />
        </>
      )}
    </div>
  );
};

export default Main;