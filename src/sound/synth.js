// Web Audio API Synthesizer for MathLand Adventure
// Self-contained sound engine that does not require static file downloads.

let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playPop() {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.15);

    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.15);
  } catch (e) {
    console.warn('Audio Context failed to play:', e);
  }
}

export function playCorrect() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    // Play an upbeat 3-note ascending arpeggio (C5 -> E5 -> G5)
    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
    const noteDuration = 0.08;
    const gap = 0.06;

    notes.forEach((freq, index) => {
      const startTime = now + index * (noteDuration + gap);
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.type = 'triangle'; // Sweet flute-like sound
      osc.frequency.setValueAtTime(freq, startTime);

      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.25, startTime + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + noteDuration);

      osc.start(startTime);
      osc.stop(startTime + noteDuration);
    });
  } catch (e) {
    console.warn('Audio Context failed to play:', e);
  }
}

export function playIncorrect() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Soft downward pitch glide
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(220, now); // A3
    osc.frequency.linearRampToValueAtTime(110, now + 0.35); // A2

    gainNode.gain.setValueAtTime(0.35, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

    osc.start(now);
    osc.stop(now + 0.35);
  } catch (e) {
    console.warn('Audio Context failed to play:', e);
  }
}

export function playFanfare() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Celebratory progression: C4 -> E4 -> G4 -> C5 (sustained chord/arpeggio)
    const notes = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5
    const durations = [0.15, 0.15, 0.15, 0.6];
    const delays = [0, 0.1, 0.2, 0.3];

    notes.forEach((freq, index) => {
      const startTime = now + delays[index];
      const duration = durations[index];
      
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);
      if (index === 3) {
        // Add a slight vibrato to the final note
        osc.frequency.setValueAtTime(freq, startTime);
        osc.frequency.linearRampToValueAtTime(freq + 5, startTime + 0.2);
        osc.frequency.linearRampToValueAtTime(freq - 5, startTime + 0.4);
      }

      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.2, startTime + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

      osc.start(startTime);
      osc.stop(startTime + duration);
    });
  } catch (e) {
    console.warn('Audio Context failed to play:', e);
  }
}
