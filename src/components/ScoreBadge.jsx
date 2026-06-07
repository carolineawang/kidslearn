import React, { useEffect, useState } from 'react';

export default function ScoreBadge({ stars, completedQuestsCount }) {
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    if (stars > 0) {
      setPulse(true);
      const timer = setTimeout(() => setPulse(false), 600);
      return () => clearTimeout(timer);
    }
  }, [stars]);

  return (
    <div className="score-badge-wrapper">
      <div className={`score-badge-item stars ${pulse ? 'pop' : ''}`}>
        <span className="score-icon">⭐</span>
        <div className="score-info">
          <span className="score-label">STARS</span>
          <span className="score-val">{stars}</span>
        </div>
      </div>

      {completedQuestsCount > 0 && (
        <div className="score-badge-item badges">
          <span className="score-icon">🏆</span>
          <div className="score-info">
            <span className="score-label">BADGES</span>
            <span className="score-val">{completedQuestsCount}</span>
          </div>
        </div>
      )}
    </div>
  );
}
