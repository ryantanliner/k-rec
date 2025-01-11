import { useState } from 'react';
import '../styles/SearchBar.css';

// Define the props for the SearchBar component
interface SearchBarProps {

  handleSongSearch: (song: Song) => void;
  songs: Song[];
}

// Define the Song object
interface Song {
  title: string;
  artist: string;
}

const SearchBar = ({ handleSongSearch, songs }: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  // State to control the visibility of the search dropdown
  const [isOpen, setIsOpen] = useState(false);

  // Filter songs based on the search term
  // Checks if song title or artist name includes the search term (case-insensitive)
  const filteredSongs = songs.filter(song =>
    song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    song.artist.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="search-container">
      <div className="search-row">
        <input
          type="text"
          placeholder="Search songs..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          className="search-input"
        />
      </div>
      {/* Dropdown menu - only shown when search is active and dropdown is open */}
      {isOpen && searchTerm && (
        <div className="search-dropdown">
          {filteredSongs.length > 0 ? (
            filteredSongs.map((song, index) => (
              <div
                key={index}
                className="search-item"
                onClick={() => {
                  setSearchTerm(song.title); // Update search term to the selected song title
                  handleSongSearch(song); // Call handleSongSearch with the selected song
                  setIsOpen(false); // Close the dropdown
                }}
              >
                <div className="song-title">{song.title}</div>
                <div className="song-artist">{song.artist}</div>
              </div>
            ))
          ) : (
            <div className="no-results">No results found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;