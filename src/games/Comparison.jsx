import React, { useState, useEffect } from 'react';
import { playPop } from '../sound/synth';

export default function Comparison({ question, onAnswer }) {
  const { prompt, answer, data } = question;
  const { items } = data;

  const [selectedId, setSelectedId] = useState(null);
  const [shakeId, setShakeId] = useState(null);

  useEffect(() => {
    setSelectedId(null);
    setShakeId(null);
  }, [question]);

  const handleItemClick = (item) => {
    // Check if correct
    // The answer is the icon value, e.g. "🐘" or "🍒", or we can match item.icon or item.id
    const isCorrect = item.icon === answer || item.id === answer;
    
    if (isCorrect) {
      setSelectedId(item.id);
      onAnswer(true);
    } else {
      playPop();
      setShakeId(item.id);
      setTimeout(() => setShakeId(null), 500);
      onAnswer(false);
    }
  };

  return (
    <div className="game-screen-layout">
      <h2 className="game-prompt">{prompt}</h2>

      {/* Comparison Items Display */}
      <div className="comparison-flex-row">
        {items.map((item) => {
          const isSelected = selectedId === item.id;
          const isShaking = shakeId === item.id;

          return (
            <div
              key={item.id}
              className={`comparison-card ${isSelected ? 'selected' : ''} ${isShaking ? 'shake' : ''}`}
              onClick={() => handleItemClick(item)}
              style={{ cursor: 'pointer' }}
            >
              {/* Scale icon based on its relative size definition */}
              <div 
                className="comparison-icon-wrapper"
                style={{ fontSize: `${item.size * 0.7}px` }}
              >
                {item.icon}
              </div>
              <span className="comparison-label">{item.name}</span>
            </div>
          );
        })}
      </div>

      <p className="counting-tip">Tap on the correct picture above! 👆</p>
    </div>
  );
}
