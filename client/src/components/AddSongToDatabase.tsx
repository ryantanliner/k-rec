import React, { useState } from 'react';
import '../styles/AddSongToDatabase.css'; // Import the CSS file

interface AddSongToDatabaseProps {
  accessToken: string;
}

const AddSongToDatabase: React.FC<AddSongToDatabaseProps> = ({ accessToken }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [songName, setSongName] = useState('');
  const [artist, setArtist] = useState('');


  const handleSubmit = async () => {
    console.log('Song Name:', songName);
    console.log('Artist:', artist);
    console.log('Access Token:', accessToken);

    // Use spotify api search to get song 
    try {
      var searchParams = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + accessToken
        }
      }
      const searchQuery = encodeURIComponent(`${songName} artist:${artist}`);

      const searchResponse = await fetch(`https://api.spotify.com/v1/search?q=${searchQuery}&type=track`, searchParams);
      const searchData = await searchResponse.json();
      const songId = searchData.tracks.items[0].id;

      console.log(songId);
      // Use spotify id to get song features
      const featuresResponse = await fetch(`https://api.spotify.com/v1/tracks/${songId}`, searchParams);
      const featuresData = await featuresResponse.json();
      console.log(featuresData);

    } catch (error) {
      console.error('Error fetching song features:', error);
    }
    setSongName('');
    setArtist('');
    setIsPopupOpen(false);
  };

  return (
    <div className="add-song-container">
      <button onClick={() => setIsPopupOpen(true)} className="add-song-button">
        Add Song
      </button>

      {isPopupOpen && (
        <div className="popup-overlay">
          <div className="popup">
            <h2 className="popup-title">Add Song</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
            >
              <div className="form-group">
                <label htmlFor="songName" className="form-label">
                  Song Name
                </label>
                <input
                  type="text"
                  id="songName"
                  value={songName}
                  onChange={(e) => setSongName(e.target.value)}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="artist" className="form-label">
                  Artist
                </label>
                <input
                  type="text"
                  id="artist"
                  value={artist}
                  onChange={(e) => setArtist(e.target.value)}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  onClick={() => setIsPopupOpen(false)}
                  className="cancel-button"
                >
                  Cancel
                </button>
                <button type="submit" className="submit-button">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddSongToDatabase;
