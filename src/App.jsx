import React, { useState, useEffect } from 'react';
import { grades, getCurriculum, getQuest, isQuestUnlocked } from './curriculum/registry';
import { playPop, playCorrect, playIncorrect, playFanfare } from './sound/synth';
import { generateDynamicQuestion } from './curriculum/generator';

// Game Renderers
import VisualCounting from './games/VisualCounting';
import Comparison from './games/Comparison';
import EquationGame from './games/EquationGame';
import PatternForest from './games/PatternForest';

// General Components
import Mascot from './components/Mascot';
import ScoreBadge from './components/ScoreBadge';
import ConfettiEffect from './components/ConfettiEffect';

const AVATARS = [
  { emoji: '🦊', name: 'Smarty Foxy' },
  { emoji: '🐼', name: 'Happy Panda' },
  { emoji: '🐯', name: 'Cool Tiger' }
];

const QUESTION_COMPONENTS = {
  'visual-counting': VisualCounting,
  'comparison': Comparison,
  'equation': EquationGame,
  'pattern-completion': PatternForest
};

export default function App() {
  // --- STATE ---
  const [screen, setScreen] = useState('character_select'); // character_select | dashboard | quest | celebration
  const [childName, setChildName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0]);
  const [stars, setStars] = useState(0);
  const [completedQuests, setCompletedQuests] = useState([]);
  
  // Grade Map Selection
  const [selectedGradeId, setSelectedGradeId] = useState('kindergarten');
  
  // Quest state
  const [activeQuest, setActiveQuest] = useState(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [mascotMsg, setMascotMsg] = useState('');
  const [celebrationActive, setCelebrationActive] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // --- LOCALSTORAGE SYNC ---
  useEffect(() => {
    const savedProfile = localStorage.getItem('kidsmath_profile');
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile);
        setChildName(parsed.name || '');
        setSelectedAvatar(AVATARS.find(a => a.emoji === parsed.avatar) || AVATARS[0]);
        setStars(parsed.stars || 0);
        setCompletedQuests(parsed.completedQuests || []);
        setScreen('dashboard'); // Jump straight to dashboard if profile exists
      } catch (e) {
        console.error('Error loading saved profile:', e);
      }
    }
  }, []);

  const saveProfile = (newStars, newCompleted) => {
    const profile = {
      name: childName || 'Math Hero',
      avatar: selectedAvatar.emoji,
      stars: newStars !== undefined ? newStars : stars,
      completedQuests: newCompleted !== undefined ? newCompleted : completedQuests
    };
    localStorage.setItem('kidsmath_profile', JSON.stringify(profile));
  };

  // --- ACTIONS ---
  const handleStartGame = () => {
    playPop();
    const finalName = childName.trim() || 'Math Hero';
    setChildName(finalName);
    saveProfile(stars, completedQuests);
    setScreen('dashboard');
    setMascotMsg(`Hi ${finalName}! Let's select a math adventure on the map! 🗺️`);
  };

  const handleSelectGrade = (gradeId) => {
    playPop();
    setSelectedGradeId(gradeId);
    setMascotMsg(`Let's unlock all the stages in ${gradeId === 'kindergarten' ? 'Kindergarten' : '1st Grade'}! You can do it! 🌟`);
  };

  const handleStartQuest = (quest) => {
    if (!isQuestUnlocked(quest, completedQuests)) {
      playIncorrect();
      setMascotMsg(`Oops! You need to finish the previous world node to unlock this stage! 🔒`);
      return;
    }

    playPop();
    setActiveQuest(quest);
    setCurrentQuestionIdx(0);
    setScreen('quest');
    setMascotMsg(`Welcome to ${quest.title}! Here is your first question. Tap items to count if you need help! 🦁`);
  };

  const handleAnswer = (isCorrect) => {
    const currentQuestion = activeQuest.questions[currentQuestionIdx];
    
    if (isCorrect) {
      playCorrect();
      
      const isLastQuestion = currentQuestionIdx === activeQuest.questions.length - 1;
      
      if (isLastQuestion) {
        // Quest Complete!
        setCelebrationActive(true);
        playFanfare();
        
        // Update stats
        const isAlreadyCompleted = completedQuests.includes(activeQuest.id);
        const nextCompleted = isAlreadyCompleted ? completedQuests : [...completedQuests, activeQuest.id];
        const nextStars = isAlreadyCompleted ? stars + 1 : stars + 3; // +3 for first run, +1 for repeat
        
        setStars(nextStars);
        setCompletedQuests(nextCompleted);
        saveProfile(nextStars, nextCompleted);
        
        setScreen('celebration');
        setMascotMsg(`HOORAY! You completed ${activeQuest.title}! You are super smart! 🏆`);
      } else {
        // Next Question
        setMascotMsg("Yay! That's correct! Keep up the great work! 🎉");
        setTimeout(() => {
          setCurrentQuestionIdx(prev => prev + 1);
          const nextQ = activeQuest.questions[currentQuestionIdx + 1];
          setMascotMsg(`Here's the next one: ${nextQ.prompt}`);
        }, 1200);
      }
    } else {
      // Wrong answer
      playIncorrect();
      setMascotMsg(currentQuestion.mascotHint || "Don't worry, try counting carefully once more!");
    }
  };

  const handleBackToDashboard = () => {
    playPop();
    setScreen('dashboard');
    setActiveQuest(null);
    setCelebrationActive(false);
    setMascotMsg(`Welcome back to the map, ${childName}! Select your next math challenge! 🗺️`);
  };

  const handleRefreshQuestion = () => {
    if (!activeQuest) return;
    playPop();
    const currentQuestion = activeQuest.questions[currentQuestionIdx];
    const newQuestion = generateDynamicQuestion(activeQuest.id, currentQuestion);

    setActiveQuest((prev) => {
      const updatedQuestions = [...prev.questions];
      updatedQuestions[currentQuestionIdx] = newQuestion;
      return {
        ...prev,
        questions: updatedQuestions
      };
    });

    setMascotMsg("Poof! 🪄 I changed the question for you! Give this one a try!");
  };

  const handleResetProfile = () => {
    playPop();
    setShowResetConfirm(true);
  };

  const confirmReset = () => {
    playPop();
    localStorage.removeItem('kidsmath_profile');
    setChildName('');
    setStars(0);
    setCompletedQuests([]);
    setScreen('character_select');
    setShowResetConfirm(false);
  };

  const cancelReset = () => {
    playPop();
    setShowResetConfirm(false);
  };

  // --- RENDER SCREENS ---

  // 1. Profile Creation Screen
  const renderCharacterSelect = () => {
    return (
      <div className="character-select-screen">
        <h2>MathLand Adventure</h2>
        <p>Pick your animal mascot and type your name to begin!</p>
        
        <div className="avatars-grid">
          {AVATARS.map((avatar) => (
            <div
              key={avatar.emoji}
              className={`avatar-card ${selectedAvatar.emoji === avatar.emoji ? 'active' : ''}`}
              onClick={() => { playPop(); setSelectedAvatar(avatar); }}
            >
              <span className="avatar-emoji">{avatar.emoji}</span>
              <span className="avatar-name">{avatar.name}</span>
            </div>
          ))}
        </div>

        <div style={{ marginBottom: '32px', width: '100%', maxWidth: '360px' }}>
          <input
            type="text"
            placeholder="Type your name..."
            value={childName}
            onChange={(e) => setChildName(e.target.value)}
            style={{
              width: '100%',
              padding: '16px',
              fontSize: '20px',
              borderRadius: '16px',
              border: '3px solid #6c5ce7',
              textAlign: 'center',
              fontWeight: 'bold',
              outline: 'none',
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)'
            }}
            maxLength={12}
          />
        </div>

        <button className="play-btn" onClick={handleStartGame}>
          Let's Play! 🚀
        </button>
      </div>
    );
  };

  // 2. Main Dashboard & World Map Screen
  const renderDashboard = () => {
    const curr = getCurriculum(selectedGradeId);
    
    return (
      <div className="dashboard-screen">
        {/* Child Profile Details */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '36px' }}>{selectedAvatar.emoji}</span>
            <div>
              <h3 style={{ fontSize: '18px', color: '#2d3436' }}>{childName}</h3>
              <button 
                onClick={handleResetProfile}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: '#ff7675', 
                  fontSize: '11px', 
                  cursor: 'pointer',
                  padding: 0,
                  fontWeight: 'bold',
                  textDecoration: 'underline'
                }}
              >
                Reset Game
              </button>
            </div>
          </div>
          <ScoreBadge stars={stars} completedQuestsCount={completedQuests.length} />
        </div>

        {/* Grade Selection */}
        <div className="grade-choice-box">
          <div style={{ display: 'flex', gap: '12px' }}>
            {grades.map((grade) => (
              <button
                key={grade.id}
                className={`grade-btn ${selectedGradeId === grade.id ? 'active' : ''}`}
                onClick={() => handleSelectGrade(grade.id)}
                style={{ flex: 1 }}
              >
                <div className="grade-btn-info">
                  <h3>{grade.title}</h3>
                  <p>{grade.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic World Map Nodes */}
        <div className="map-container">
          <h3 className="map-title">{curr?.title} Map</h3>
          
          <div className="map-nodes">
            {curr?.quests.map((quest, index) => {
              const isUnlocked = isQuestUnlocked(quest, completedQuests);
              const isCompleted = completedQuests.includes(quest.id);
              const isFirstUncompleted = isUnlocked && !isCompleted;
              
              // Node styling triggers
              let nodeClass = 'locked';
              if (isCompleted) nodeClass = 'completed';
              else if (isFirstUncompleted) nodeClass = 'active-node';

              return (
                <div key={quest.id} className="map-node-wrapper">
                  <div
                    className={`map-node ${nodeClass}`}
                    onClick={() => handleStartQuest(quest)}
                  >
                    <span>{isUnlocked ? quest.emoji : '🔒'}</span>
                    
                    {/* Visual markers */}
                    {isCompleted && <span className="node-stars-count">⭐ 3/3</span>}
                  </div>
                  <div className="map-node-title">{quest.title}</div>
                  
                  {/* Connect node to the next unless it's the last one */}
                  {index < curr.quests.length - 1 && (
                    <div className="map-connector"></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Mascot companion */}
        <Mascot message={mascotMsg || `Tap me for advice, ${childName}!`} />
      </div>
    );
  };

  // 3. Quest / Question solving screen
  const renderQuest = () => {
    const questions = activeQuest.questions;
    const currentQuestion = questions[currentQuestionIdx];
    const GameComponent = QUESTION_COMPONENTS[currentQuestion.type] || VisualCounting;

    return (
      <div className="game-area-container">
        {/* Header navigation & progress */}
        <div className="game-progress-header">
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              className="back-to-map-btn"
              onClick={handleBackToDashboard}
            >
              🗺️ Back to Map
            </button>
            <button 
              className="change-question-btn"
              onClick={handleRefreshQuestion}
              title="Change this question to a different one!"
            >
              🔄 Change Question
            </button>
          </div>
          
          <div className="game-progress-bar">
            <div 
              className="game-progress-fill"
              style={{ width: `${((currentQuestionIdx) / questions.length) * 100}%` }}
            />
          </div>

          <span style={{ fontWeight: 'bold', minWidth: '45px', textAlign: 'right' }}>
            {currentQuestionIdx + 1} / {questions.length}
          </span>
        </div>

        {/* Interactive Question Panel */}
        <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <GameComponent 
            question={currentQuestion} 
            onAnswer={handleAnswer} 
          />
        </div>

        {/* Guidance Mascot */}
        <Mascot message={mascotMsg} />
      </div>
    );
  };

  // 4. Celebration level completion screen
  const renderCelebration = () => {
    return (
      <div className="celebration-screen">
        <div className="trophy-display">🏆</div>
        <h2>QUEST COMPLETE!</h2>
        <p>Outstanding job, {childName}! You beat all levels in <strong>{activeQuest?.title}</strong>!</p>
        
        <div className="celebration-stars-gained">
          ⭐ +3 STARS EARNED!
        </div>

        <div>
          <button 
            className="play-btn" 
            onClick={handleBackToDashboard}
            style={{ width: '100%', maxWidth: '240px' }}
          >
            Yay! Back to Map
          </button>
        </div>

        <Mascot message={mascotMsg} highlight={true} />
      </div>
    );
  };

  return (
    <>
      <header className="game-header">
        <h1 className="game-title"><span>✏️</span> MathQuest</h1>
        {screen !== 'character_select' && (
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
            ⭐ {stars}
          </div>
        )}
      </header>

      {/* Confetti Explosion Component */}
      <ConfettiEffect active={celebrationActive} />

      {screen === 'character_select' && renderCharacterSelect()}
      {screen === 'dashboard' && renderDashboard()}
      {screen === 'quest' && renderQuest()}
      {screen === 'celebration' && renderCelebration()}

      {showResetConfirm && (
        <div className="modal-overlay">
          <div className="modal-content pop">
            <h3>Start a New Game? 🤔</h3>
            <p>This will erase your stars and badges so you can play from the beginning!</p>
            <div className="modal-buttons">
              <button className="modal-btn confirm" onClick={confirmReset}>Yes, Reset! 🧹</button>
              <button className="modal-btn cancel" onClick={cancelReset}>No, Keep Playing! 🎮</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
