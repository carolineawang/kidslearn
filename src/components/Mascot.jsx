import React, { useState, useEffect } from 'react';
import { playPop } from '../sound/synth';

const JOKES = [
  "Why did the math book look sad? Because it had too many problems!",
  "What is a math teacher's favorite dessert? Pi!",
  "Why is the number 6 afraid of 7? Because 7 ate 9!",
  "Are monsters good at math? Not unless you count Dracula!",
  "Which tool is best for math? Multi-pliers!",
  "Why did the triangle stand out? It had pointier arguments!",
  "You are doing an AMAZING job! Let's count some more!",
  "Math is like a superpower! Keep going!",
  "Did you know a circle is just a square with rounded corners? Just kidding!"
];

export default function Mascot({ message, highlight }) {
  const [bubbleText, setBubbleText] = useState(message);
  const [isBouncing, setIsBouncing] = useState(false);

  useEffect(() => {
    setBubbleText(message);
  }, [message]);

  const handleTap = () => {
    playPop();
    setIsBouncing(true);
    // Select a random joke/phrase
    const randomIdx = Math.floor(Math.random() * JOKES.length);
    setBubbleText(JOKES[randomIdx]);
    setTimeout(() => setIsBouncing(false), 800);
  };

  return (
    <div className={`mascot-container ${highlight ? 'highlight' : ''}`} onClick={handleTap}>
      <div className="mascot-speech-bubble">
        <p>{bubbleText}</p>
        <span className="mascot-speech-tip"></span>
      </div>

      <div className={`mascot-avatar ${isBouncing ? 'mascot-bounce' : ''}`}>
        {/* Playful friendly robot SVG */}
        <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Antenna */}
          <rect x="47" y="10" width="6" height="15" rx="3" fill="#fdcb6e" />
          <circle cx="50" cy="8" r="6" fill="#ffeaa7" className="antenna-glow" />
          
          {/* Ears/Side Bolts */}
          <rect x="18" y="42" width="8" height="16" rx="4" fill="#a29bfe" />
          <rect x="74" y="42" width="8" height="16" rx="4" fill="#a29bfe" />

          {/* Body/Head */}
          <rect x="24" y="25" width="52" height="50" rx="16" fill="#6c5ce7" stroke="#4834d4" strokeWidth="4" />
          
          {/* Screen Face */}
          <rect x="30" y="31" width="40" height="32" rx="10" fill="#2d3436" />
          
          {/* Eyes */}
          <circle cx="42" cy="45" r="5" fill="#55efc4" className="mascot-eye" />
          <circle cx="58" cy="45" r="5" fill="#55efc4" className="mascot-eye" />
          <circle cx="43" cy="43" r="1.5" fill="#ffffff" />
          <circle cx="59" cy="43" r="1.5" fill="#ffffff" />

          {/* Mouth (Happy Curve) */}
          <path d="M 44 54 Q 50 59 56 54" stroke="#55efc4" strokeWidth="3" strokeLinecap="round" fill="none" />

          {/* Tiny cute blush circles */}
          <circle cx="36" cy="51" r="2.5" fill="#ff7675" opacity="0.6" />
          <circle cx="64" cy="51" r="2.5" fill="#ff7675" opacity="0.6" />

          {/* Little feet/wheels */}
          <circle cx="40" cy="80" r="8" fill="#ffeaa7" stroke="#fdcb6e" strokeWidth="3" />
          <circle cx="60" cy="80" r="8" fill="#ffeaa7" stroke="#fdcb6e" strokeWidth="3" />
        </svg>
      </div>
    </div>
  );
}
