import React from 'react';
import { playPop } from '../sound/synth';

export default function BackToMapButton({ onClick }) {
  const handleClick = () => {
    playPop();
    onClick();
  };

  return (
    <button className="back-to-map-btn" onClick={handleClick}>
      <span className="btn-icon">🗺️</span>
      <span className="btn-text">World Map</span>
    </button>
  );
}
