import React, { useState, useEffect } from 'react';
import { playPop } from '../sound/synth';

export default function EquationGame({ question, onAnswer }) {
  const { prompt, options, answer, data } = question;
  const { num1, num2, operator, icon } = data;

  const [poppedIndices, setPoppedIndices] = useState({});
  const [shakeButton, setShakeButton] = useState(null);

  useEffect(() => {
    setPoppedIndices({});
    setShakeButton(null);
  }, [question]);

  const handlePopItem = (index) => {
    if (operator !== '-') return; // Popping is specifically for subtraction take-away!
    
    playPop();
    setPoppedIndices((prev) => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleOptionClick = (option) => {
    if (option === answer) {
      onAnswer(true);
    } else {
      playPop();
      setShakeButton(option);
      setTimeout(() => setShakeButton(null), 500);
      onAnswer(false);
    }
  };

  // Addition Layout: side-by-side groups
  const renderAdditionVisuals = () => {
    const list1 = Array.from({ length: num1 });
    const list2 = Array.from({ length: num2 });

    return (
      <div className="equation-visuals-container">
        <div className="equation-group">
          {list1.map((_, i) => (
            <span key={`l-${i}`} className="eq-item-emoji">{icon}</span>
          ))}
          <span className="group-label-number">{num1}</span>
        </div>

        <span className="equation-sign">＋</span>

        <div className="equation-group">
          {list2.map((_, i) => (
            <span key={`r-${i}`} className="eq-item-emoji">{icon}</span>
          ))}
          <span className="group-label-number">{num2}</span>
        </div>
      </div>
    );
  };

  // Subtraction Layout: single group where items can be tapped/popped
  const renderSubtractionVisuals = () => {
    const list = Array.from({ length: num1 });
    const poppedCount = Object.values(poppedIndices).filter(Boolean).length;

    return (
      <div className="equation-visuals-container subtraction">
        <div className="subtraction-instruction">
          Tap to pop <strong>{num2}</strong> {icon === '🎈' ? 'balloons' : 'items'}!
          <div className="subtraction-counter">
            Popped: {poppedCount} of {num2}
          </div>
        </div>

        <div className="equation-group main-group">
          {list.map((_, idx) => {
            const isPopped = !!poppedIndices[idx];
            return (
              <div
                key={idx}
                className={`eq-item-box ${isPopped ? 'popped' : ''}`}
                onClick={() => handlePopItem(idx)}
              >
                <span className="eq-item-emoji">{isPopped ? '💥' : icon}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="game-screen-layout">
      <h2 className="game-prompt">{prompt}</h2>

      {/* Visual Helpers */}
      {operator === '+' ? renderAdditionVisuals() : renderSubtractionVisuals()}

      {/* Large Equation text */}
      <div className="big-equation-text">
        {num1} {operator === '+' ? '＋' : '－'} {num2} ＝ <span className="eq-question-mark">?</span>
      </div>

      {/* Multiple Choice Options */}
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
