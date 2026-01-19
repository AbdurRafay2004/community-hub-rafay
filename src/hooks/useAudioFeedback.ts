import { useCallback, useRef } from 'react';

type SoundType = 
  | 'buttonPress' 
  | 'buttonRelease'
  | 'countdownTick' 
  | 'alertSent' 
  | 'alertCancelled'
  | 'success'
  | 'error'
  | 'notification'
  | 'wakeWord'
  | 'listeningStart'
  | 'listeningEnd';

interface UseAudioFeedbackReturn {
  playSound: (type: SoundType) => void;
  setEnabled: (enabled: boolean) => void;
  isEnabled: boolean;
}

// Create audio context lazily to avoid autoplay restrictions
let audioContext: AudioContext | null = null;

const getAudioContext = (): AudioContext | null => {
  if (typeof window === 'undefined') return null;
  
  if (!audioContext) {
    try {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (e) {
      console.warn('[AudioFeedback] AudioContext not supported');
      return null;
    }
  }
  
  // Resume if suspended (due to autoplay policy)
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
  
  return audioContext;
};

// Sound generators using Web Audio API
const generateTone = (
  ctx: AudioContext,
  frequency: number,
  duration: number,
  type: OscillatorType = 'sine',
  volume: number = 0.3
): void => {
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);
  
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
  
  // Envelope for smooth attack/release
  gainNode.gain.setValueAtTime(0, ctx.currentTime);
  gainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.01);
  gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + duration);
  
  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + duration);
};

const generateChord = (
  ctx: AudioContext,
  frequencies: number[],
  duration: number,
  volume: number = 0.2
): void => {
  frequencies.forEach(freq => {
    generateTone(ctx, freq, duration, 'sine', volume / frequencies.length);
  });
};

const generateBeep = (
  ctx: AudioContext,
  frequency: number,
  duration: number,
  count: number = 1,
  gap: number = 0.1,
  volume: number = 0.3
): void => {
  for (let i = 0; i < count; i++) {
    const startTime = ctx.currentTime + i * (duration + gap);
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, startTime);
    
    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(volume, startTime + 0.01);
    gainNode.gain.linearRampToValueAtTime(0, startTime + duration);
    
    oscillator.start(startTime);
    oscillator.stop(startTime + duration);
  }
};

// Sound definitions
const playButtonPress = (ctx: AudioContext): void => {
  generateTone(ctx, 800, 0.08, 'sine', 0.15);
};

const playButtonRelease = (ctx: AudioContext): void => {
  generateTone(ctx, 600, 0.05, 'sine', 0.1);
};

const playCountdownTick = (ctx: AudioContext): void => {
  generateTone(ctx, 440, 0.15, 'sine', 0.25);
};

const playAlertSent = (ctx: AudioContext): void => {
  // Urgent escalating tones
  const times = [0, 0.15, 0.3];
  const freqs = [523, 659, 784]; // C5, E5, G5
  
  times.forEach((time, i) => {
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(freqs[i], ctx.currentTime + time);
    
    gainNode.gain.setValueAtTime(0, ctx.currentTime + time);
    gainNode.gain.linearRampToValueAtTime(0.35, ctx.currentTime + time + 0.02);
    gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + time + 0.15);
    
    oscillator.start(ctx.currentTime + time);
    oscillator.stop(ctx.currentTime + time + 0.15);
  });
};

const playAlertCancelled = (ctx: AudioContext): void => {
  // Descending tone to indicate cancellation
  generateTone(ctx, 600, 0.15, 'sine', 0.2);
  setTimeout(() => generateTone(ctx, 400, 0.2, 'sine', 0.15), 150);
};

const playSuccess = (ctx: AudioContext): void => {
  generateChord(ctx, [523, 659, 784], 0.3, 0.3); // C major chord
};

const playError = (ctx: AudioContext): void => {
  generateBeep(ctx, 200, 0.15, 2, 0.08, 0.3);
};

const playNotification = (ctx: AudioContext): void => {
  generateTone(ctx, 880, 0.1, 'sine', 0.2);
  setTimeout(() => generateTone(ctx, 1100, 0.15, 'sine', 0.2), 120);
};

const playWakeWord = (ctx: AudioContext): void => {
  // Gentle "ding" to indicate wake word detected
  generateChord(ctx, [698, 880], 0.25, 0.25); // F5 + A5
};

const playListeningStart = (ctx: AudioContext): void => {
  // Rising tone
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);
  
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(400, ctx.currentTime);
  oscillator.frequency.linearRampToValueAtTime(800, ctx.currentTime + 0.15);
  
  gainNode.gain.setValueAtTime(0, ctx.currentTime);
  gainNode.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.02);
  gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.15);
  
  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + 0.15);
};

const playListeningEnd = (ctx: AudioContext): void => {
  // Falling tone
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);
  
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(800, ctx.currentTime);
  oscillator.frequency.linearRampToValueAtTime(400, ctx.currentTime + 0.15);
  
  gainNode.gain.setValueAtTime(0, ctx.currentTime);
  gainNode.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.02);
  gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.15);
  
  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + 0.15);
};

export const useAudioFeedback = (): UseAudioFeedbackReturn => {
  const enabledRef = useRef(true);

  const playSound = useCallback((type: SoundType) => {
    if (!enabledRef.current) return;
    
    const ctx = getAudioContext();
    if (!ctx) return;

    switch (type) {
      case 'buttonPress':
        playButtonPress(ctx);
        break;
      case 'buttonRelease':
        playButtonRelease(ctx);
        break;
      case 'countdownTick':
        playCountdownTick(ctx);
        break;
      case 'alertSent':
        playAlertSent(ctx);
        break;
      case 'alertCancelled':
        playAlertCancelled(ctx);
        break;
      case 'success':
        playSuccess(ctx);
        break;
      case 'error':
        playError(ctx);
        break;
      case 'notification':
        playNotification(ctx);
        break;
      case 'wakeWord':
        playWakeWord(ctx);
        break;
      case 'listeningStart':
        playListeningStart(ctx);
        break;
      case 'listeningEnd':
        playListeningEnd(ctx);
        break;
    }
  }, []);

  const setEnabled = useCallback((enabled: boolean) => {
    enabledRef.current = enabled;
  }, []);

  return {
    playSound,
    setEnabled,
    isEnabled: enabledRef.current,
  };
};

// Export a singleton for use outside of React components
export const audioFeedback = {
  play: (type: SoundType) => {
    const ctx = getAudioContext();
    if (!ctx) return;

    switch (type) {
      case 'buttonPress':
        playButtonPress(ctx);
        break;
      case 'buttonRelease':
        playButtonRelease(ctx);
        break;
      case 'countdownTick':
        playCountdownTick(ctx);
        break;
      case 'alertSent':
        playAlertSent(ctx);
        break;
      case 'alertCancelled':
        playAlertCancelled(ctx);
        break;
      case 'success':
        playSuccess(ctx);
        break;
      case 'error':
        playError(ctx);
        break;
      case 'notification':
        playNotification(ctx);
        break;
      case 'wakeWord':
        playWakeWord(ctx);
        break;
      case 'listeningStart':
        playListeningStart(ctx);
        break;
      case 'listeningEnd':
        playListeningEnd(ctx);
        break;
    }
  }
};
