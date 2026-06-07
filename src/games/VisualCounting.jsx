import React, { useState, useEffect } from 'react';
import { playPop } from '../sound/synth';

export default function VisualCounting({ question, onAnswer }) {
  const { prompt, options, answer, data } = question;
  const { icon, count } = data;

  // Track which items have been counted/clicked by the child
  const [countedIndices, setCountedIndices] = useState({});
  const [nextCount, setNextCount] = useState(1);
  const [shakeButton, setShakeButton] = useState(null);

  // Reset state on question change
  useEffect(() => {
    setCountedIndices({});
    setNextCount(1);
    setShakeButton(null);
  }, [question]);

  const handleItemClick = (index) => {
    if (countedIndices[index] !== undefined) return; // Already counted

    playPop();
    setCountedIndices((prev) => ({
      ...prev,
      [index]: nextCount
    }));
    setNextCount((prev) => prev + 1);
  };

  const handleOptionClick = (option) => {
    if (option === answer) {
      onAnswer(true);
    } else {
      playPop();
      setShakeButton(option);
      setTimeout(() => setShakeButton(null), 500);
      onAnswer(false); // Reports incorrect, triggers mascot advice
    }
  };

  // Generate an array of size `count`
  const items = Array.from({ length: count });

  return (
    <div className="game-screen-layout">
      <h2 className="game-prompt">{prompt}</h2>

      {/* Interactive Visual Counter Container */}
      <div className="counting-items-grid">
        {items.map((_, idx) => {
          const countLabel = countedIndices[idx];
          const isCounted = countLabel !== undefined;

          return (
            <div
              key={idx}
              className={`counting-item ${isCounted ? 'counted' : ''}`}
              onClick={() => handleItemClick(idx)}
            >
              <span className="counting-emoji">{icon}</span>
              {isCounted && <span className="counting-badge">{countLabel}</span>}
            </div>
          );
        })}
      </div>

      <p className="counting-tip">
        {nextCount <= count 
          ? "Tap the items to count them! 👆" 
          : "Great counting! Now select the correct number below. 👇"}
      </p>

      {/* Large Multiple Choice Bubbles */}
      <div className="options-container">
        {options.map((option) => (
          <button
            key={option}
            className={`option-bubble ${shakeButton === option ? 'shake' : ''}`}
            onClick={() => handleOptionClick(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
