import { useState } from 'react';
import '../styles/TraitsSelector.css';

// Define props for TraitsSelector component
interface TraitsSelectorProps {
  selectedTraits: string[];
  handleTraitsChange: (traits: string[]) => void;
}

const TraitsSelector = ({ selectedTraits, handleTraitsChange }: TraitsSelectorProps) => {
  // State to control the visibility of the traits dropdown
  const [isOpen, setIsOpen] = useState(false);

  const traits = ['danceability', 'energy', 'key', 'loudness', 'mode', 'speechiness', 'acousticness', 'valence', 'tempo']

  // Handler for toggling individual traits
  const toggleTrait = (trait: string) => {
    // If trait is already selected, remove it from selectedTraits
    // If trait is not selected, add it to selectedTraits
    const newTraits = selectedTraits.includes(trait)
      ? selectedTraits.filter(t => t !== trait)
      : [...selectedTraits, trait];
    
    handleTraitsChange(newTraits);
  };

  // Handler for toggling all traits at once
  const toggleAll = () => {
    const newTraits = selectedTraits.length === traits.length ? [] : [...traits];
    handleTraitsChange(newTraits);
  };

  return (
    <div className="traits-selector">
      <button 
        className="traits-button"
        onClick={() => setIsOpen(!isOpen)}
      >
        Select Traits ({selectedTraits.length})
      </button>
      {/* Dropdown menu - only shown when isOpen is true */}
      {isOpen && (
        <div className="traits-dropdown">
          {/* Select All option */}
          <div 
            className={`trait-item select-all ${selectedTraits.length === traits.length ? 'selected' : ''}`}
            onClick={toggleAll}
          >
            <input
              type="checkbox"
              checked={selectedTraits.length === traits.length}
              readOnly
            />
            <span>Select All</span>
          </div>
          <div className="divider"></div>
          {/* Individual trait options */}
          {traits.map(trait => (
            <div 
              key={trait}
              className={`trait-item ${selectedTraits.includes(trait) ? 'selected' : ''}`}
              onClick={() => toggleTrait(trait)}
            >
              <input
                type="checkbox"
                checked={selectedTraits.includes(trait)}
                readOnly
              />
              <span>{trait}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TraitsSelector;