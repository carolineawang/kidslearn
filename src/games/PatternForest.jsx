import React, { useState, useEffect } from 'react';
import { playPop } from '../sound/synth';

export default function PatternForest({ question, onAnswer }) {
  const { prompt, options, answer, data } = question;
  const { sequence } = data;

  const [selectedVal, setSelectedVal] = useState(null);
  const [shakeButton, setShakeButton] = useState(null);

  useEffect(() => {
    setSelectedVal(null);
    setShakeButton(null);
  }, [question]);

  const handleOptionClick = (option) => {
    if (option === answer) {
      setSelectedVal(option);
      onAnswer(true);
    } else {
      playPop();
      setShakeButton(option);
      setTimeout(() => setShakeButton(null), 500);
      onAnswer(false);
    }
  };

  return (
    <div className="game-screen-layout">
      <h2 className="game-prompt">{prompt}</h2>

      {/* Path sequence visual */}
      <div className="pattern-path-container">
        {sequence.map((num, idx) => {
          const isNull = num === null;
          
          return (
            <React.Fragment key={idx}>
              <div 
                className={`pattern-stone ${isNull ? 'missing' : ''} ${isNull && selectedVal !== null ? 'solved' : ''}`}
              >
                {isNull ? (
                  selectedVal !== null ? selectedVal : '?'
                ) : (
                  num
                )}
              </div>
              {idx < sequence.length - 1 && (
                <div className="pattern-connector">➡️</div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      <p className="counting-tip">{data.tip || "Look at the pattern! What comes next? 🤔"}</p>

      {/* Options */}
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
