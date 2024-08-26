import React, { useState, useEffect, useCallback } from 'react';
import '../styles/BinauralBeats.css';

const categories = [
  { name: 'Relax', icon: '🧘' },
  { name: 'Focus', icon: '🎯' },
  { name: 'Energize', icon: '⚡' },
  { name: 'Sleep', icon: '💤' },
  { name: 'Meditate', icon: '🕉️' },
];

const BinauralBeats = ({ onMusicStart }) => {
  const [activeCategory, setActiveCategory] = useState(null);
  const [audio, setAudio] = useState(null);

  // Use useCallback to memoize stopAudio function
  const stopAudio = useCallback(() => {
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  }, [audio]);

  useEffect(() => {
    // Cleanup when the component is unmounted or the audio changes
    return () => {
      stopAudio();
    };
  }, [stopAudio]); // Include stopAudio in the dependency array

  const handleCategoryClick = async (category) => {
    stopAudio();

    try {
      const response = await fetch(`http://127.0.0.1:8080/api/music/${category}`);
      const data = await response.json();

      const newAudio = new Audio(data.url);
      newAudio.loop = true;
      await newAudio.play();

      setAudio(newAudio);
      setActiveCategory(category);
      onMusicStart(newAudio);
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  return (
    <div className="binaural-beats">
      <div className="categories">
        {categories.map((category) => (
          <button
            key={category.name}
            onClick={() => handleCategoryClick(category.name)}
            className={`category-button ${activeCategory === category.name ? 'active' : ''}`}
          >
            <span className="category-icon">{category.icon}</span>
            <span className="category-name">{category.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BinauralBeats;
