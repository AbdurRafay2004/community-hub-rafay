import { useState, useCallback, useRef, useEffect } from 'react';

interface UseWakeWordOptions {
  wakeWords?: string[];
  enabled?: boolean;
  onWake?: () => void;
  language?: 'en-US' | 'bn-BD';
}

interface UseWakeWordReturn {
  isSupported: boolean;
  isListening: boolean;
  isActive: boolean;
  lastHeard: string;
  startPassiveListening: () => Promise<boolean>;
  stopPassiveListening: () => void;
  requestPermission: () => Promise<boolean>;
}

// Speech recognition types
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
  onstart: () => void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

const getSpeechRecognition = () => {
  if (typeof window === 'undefined') return null;
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
};

export const useWakeWord = ({
  wakeWords = ['hey assistant', 'hi assistant', 'ok assistant', 'hello assistant'],
  enabled = true,
  onWake,
  language = 'en-US',
}: UseWakeWordOptions = {}): UseWakeWordReturn => {
  const [isSupported] = useState(() => !!getSpeechRecognition());
  const [isListening, setIsListening] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [lastHeard, setLastHeard] = useState('');

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const onWakeRef = useRef(onWake);
  const enabledRef = useRef(enabled);
  const shouldRestartRef = useRef(false);
  const manualStopRef = useRef(false);
  const cooldownRef = useRef(false);
  const restartTimeoutRef = useRef<number | null>(null);
  const isStartingRef = useRef(false);

  // Keep refs updated
  useEffect(() => {
    onWakeRef.current = onWake;
  }, [onWake]);

  useEffect(() => {
    enabledRef.current = enabled;
  }, [enabled]);

  const normalizeText = (text: string): string => {
    return text.toLowerCase().trim().replace(/[^\w\s]/g, '');
  };

  const checkForWakeWord = useCallback((transcript: string): boolean => {
    const normalized = normalizeText(transcript);
    
    for (const wakeWord of wakeWords) {
      const normalizedWakeWord = normalizeText(wakeWord);
      if (normalized.includes(normalizedWakeWord)) {
        console.log(`[WakeWord] Detected: "${wakeWord}" in "${transcript}"`);
        return true;
      }
    }
    return false;
  }, [wakeWords]);

  const clearRestartTimeout = useCallback(() => {
    if (restartTimeoutRef.current) {
      clearTimeout(restartTimeoutRef.current);
      restartTimeoutRef.current = null;
    }
  }, []);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!isSupported) return false;

    // Prefer the Permissions API to avoid opening/closing a mic stream (which can cause
    // rapid connect/disconnect notifications on mobile).
    try {
      const maybePermissions = (navigator as any).permissions;
      if (maybePermissions?.query) {
        const status = await maybePermissions.query({ name: "microphone" });
        if (status.state === "granted") return true;
        if (status.state === "denied") return false;
        // state === "prompt" -> fall through to getUserMedia() to trigger the prompt.
      }
    } catch {
      // Ignore and fall back.
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());
      return true;
    } catch (error) {
      console.error("[WakeWord] Permission denied:", error);
      return false;
    }
  }, [isSupported]);

  const stopPassiveListening = useCallback(() => {
    console.log('[WakeWord] Stopping passive listening');
    manualStopRef.current = true;
    shouldRestartRef.current = false;
    isStartingRef.current = false;
    clearRestartTimeout();
    
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (e) {
        // Ignore
      }
      recognitionRef.current = null;
    }
    setIsListening(false);
    setIsActive(false);
  }, [clearRestartTimeout]);

  const createRecognition = useCallback(() => {
    const SpeechRecognitionClass = getSpeechRecognition();
    if (!SpeechRecognitionClass) return null;

    const recognition = new SpeechRecognitionClass();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = language;

    recognition.onstart = () => {
      console.log('[WakeWord] Started passive listening');
      isStartingRef.current = false;
      setIsListening(true);
      setIsActive(true);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      if (cooldownRef.current || manualStopRef.current) return;

      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }

      setLastHeard(transcript);

      if (checkForWakeWord(transcript)) {
        console.log('[WakeWord] Wake word detected! Triggering callback...');
        cooldownRef.current = true;
        
        // Stop listening before triggering wake callback
        manualStopRef.current = true;
        shouldRestartRef.current = false;
        
        try {
          recognition.abort();
        } catch (e) {
          // Ignore
        }
        
        // Trigger the wake callback
        onWakeRef.current?.();
        
        // Reset cooldown after 3 seconds
        setTimeout(() => {
          cooldownRef.current = false;
        }, 3000);
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('[WakeWord] Error:', event.error);
      isStartingRef.current = false;
      
      if (event.error === 'not-allowed') {
        shouldRestartRef.current = false;
        setIsListening(false);
        setIsActive(false);
        return;
      }
      
      // For other errors, we'll restart in onend
    };

    recognition.onend = () => {
      console.log('[WakeWord] Recognition ended');
      isStartingRef.current = false;
      
      if (shouldRestartRef.current && enabledRef.current && !manualStopRef.current) {
        console.log('[WakeWord] Scheduling restart...');
        clearRestartTimeout();
        restartTimeoutRef.current = window.setTimeout(() => {
          if (shouldRestartRef.current && enabledRef.current && !manualStopRef.current && !isStartingRef.current) {
            console.log('[WakeWord] Restarting...');
            isStartingRef.current = true;
            try {
              const newRecognition = createRecognition();
              if (newRecognition) {
                recognitionRef.current = newRecognition;
                newRecognition.start();
              }
            } catch (e) {
              console.error('[WakeWord] Restart failed:', e);
              isStartingRef.current = false;
              setIsListening(false);
              setIsActive(false);
            }
          }
        }, 300);
      } else {
        setIsListening(false);
        setIsActive(false);
        recognitionRef.current = null;
      }
    };

    return recognition;
  }, [language, checkForWakeWord, clearRestartTimeout]);

  const startPassiveListening = useCallback(async (): Promise<boolean> => {
    const SpeechRecognitionClass = getSpeechRecognition();
    
    // Only check if SpeechRecognition is supported - don't block on `enabled` prop
    // The `enabled` prop controls auto-restart, not manual start
    if (!SpeechRecognitionClass) {
      console.log('[WakeWord] Cannot start - SpeechRecognition not supported');
      return false;
    }

    // Prevent multiple start attempts
    if (isStartingRef.current) {
      console.log('[WakeWord] Already starting');
      return true;
    }

    // Request permission first
    const hasPermission = await requestPermission();
    if (!hasPermission) {
      console.log('[WakeWord] Permission denied');
      return false;
    }

    // If already listening, don't start again
    if (isListening && recognitionRef.current) {
      console.log('[WakeWord] Already listening');
      return true;
    }

    try {
      clearRestartTimeout();
      
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {
          // Ignore
        }
        recognitionRef.current = null;
      }

      manualStopRef.current = false;
      shouldRestartRef.current = true;
      isStartingRef.current = true;

      const recognition = createRecognition();
      if (!recognition) {
        isStartingRef.current = false;
        return false;
      }

      recognitionRef.current = recognition;
      recognition.start();
      console.log('[WakeWord] Started successfully');
      return true;
    } catch (error) {
      console.error('[WakeWord] Failed to start:', error);
      isStartingRef.current = false;
      setIsListening(false);
      setIsActive(false);
      return false;
    }
  }, [isListening, requestPermission, clearRestartTimeout, createRecognition]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearRestartTimeout();
      manualStopRef.current = true;
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {
          // Ignore
        }
      }
    };
  }, [clearRestartTimeout]);

  // Stop when disabled
  useEffect(() => {
    if (!enabled && isListening) {
      stopPassiveListening();
    }
  }, [enabled, isListening, stopPassiveListening]);

  return {
    isSupported,
    isListening,
    isActive,
    lastHeard,
    startPassiveListening,
    stopPassiveListening,
    requestPermission,
  };
};

