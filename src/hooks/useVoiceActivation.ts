import { useState, useEffect, useCallback, useRef } from 'react';

interface UseVoiceActivationOptions {
  triggerPhrase?: string;
  enabled?: boolean;
  onTrigger?: () => void;
  continuous?: boolean;
}

interface UseVoiceActivationReturn {
  isSupported: boolean;
  isListening: boolean;
  permissionGranted: boolean;
  lastHeard: string;
  startListening: () => Promise<boolean>;
  stopListening: () => void;
  requestPermission: () => Promise<boolean>;
}

// Check for SpeechRecognition support
const getSpeechRecognition = () => {
  if (typeof window === 'undefined') return null;
  return (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition || null;
};

export const useVoiceActivation = ({
  triggerPhrase = "help me now",
  enabled = true,
  onTrigger,
  continuous = true,
}: UseVoiceActivationOptions = {}): UseVoiceActivationReturn => {
  const [isSupported] = useState(() => !!getSpeechRecognition());
  const [isListening, setIsListening] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [lastHeard, setLastHeard] = useState("");
  
  const recognitionRef = useRef<any>(null);
  const onTriggerRef = useRef(onTrigger);
  const enabledRef = useRef(enabled);
  const continuousRef = useRef(continuous);
  const isListeningRef = useRef(false);
  const shouldRestartRef = useRef(false);
  const restartTimeoutRef = useRef<number | null>(null);
  const triggerCooldownRef = useRef(false);
  const manualStopRef = useRef(false);

  // Keep refs updated
  useEffect(() => {
    onTriggerRef.current = onTrigger;
  }, [onTrigger]);

  useEffect(() => {
    enabledRef.current = enabled;
  }, [enabled]);

  useEffect(() => {
    continuousRef.current = continuous;
  }, [continuous]);

  const normalizeText = (text: string): string => {
    return text.toLowerCase().trim().replace(/[^\w\s]/g, '');
  };

  const checkForTriggerPhrase = useCallback((transcript: string) => {
    const normalized = normalizeText(transcript);
    const normalizedTrigger = normalizeText(triggerPhrase);
    
    // Check if the trigger phrase is contained in the transcript
    if (normalized.includes(normalizedTrigger)) {
      console.log(`[VoiceActivation] Trigger phrase detected: "${transcript}"`);
      return true;
    }
    
    // Also check for common variations
    const variations = [
      "help me",
      "help now",
      "i need help",
      "emergency",
      "sos",
    ];
    
    for (const variation of variations) {
      if (normalized.includes(variation)) {
        console.log(`[VoiceActivation] Variation detected: "${variation}" in "${transcript}"`);
        return true;
      }
    }
    
    return false;
  }, [triggerPhrase]);

  const clearRestartTimeout = useCallback(() => {
    if (restartTimeoutRef.current) {
      clearTimeout(restartTimeoutRef.current);
      restartTimeoutRef.current = null;
    }
  }, []);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!isSupported) {
      console.warn('[VoiceActivation] Speech recognition not supported');
      return false;
    }

    try {
      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop()); // Stop the stream, we just needed permission
      setPermissionGranted(true);
      return true;
    } catch (error) {
      console.error('[VoiceActivation] Microphone permission denied:', error);
      setPermissionGranted(false);
      return false;
    }
  }, [isSupported]);

  const stopListening = useCallback(() => {
    console.log('[VoiceActivation] Manual stop requested');
    manualStopRef.current = true;
    shouldRestartRef.current = false;
    isListeningRef.current = false;
    clearRestartTimeout();
    
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // Ignore errors when stopping
      }
      recognitionRef.current = null;
    }
    setIsListening(false);
  }, [clearRestartTimeout]);

  const startListening = useCallback(async (): Promise<boolean> => {
    const SpeechRecognition = getSpeechRecognition();
    
    if (!SpeechRecognition || !enabledRef.current) {
      console.log('[VoiceActivation] Cannot start - not supported or not enabled');
      return false;
    }

    // Ensure we have permission
    if (!permissionGranted) {
      const granted = await requestPermission();
      if (!granted) return false;
    }

    // If already listening, don't start again
    if (isListeningRef.current && recognitionRef.current) {
      console.log('[VoiceActivation] Already listening');
      return true;
    }

    try {
      // Clean up any existing recognition
      clearRestartTimeout();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // Ignore
        }
        recognitionRef.current = null;
      }

      manualStopRef.current = false;
      shouldRestartRef.current = continuousRef.current;

      const recognition = new SpeechRecognition();
      recognition.continuous = continuousRef.current;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      recognition.maxAlternatives = 3;

      recognition.onstart = () => {
        console.log('[VoiceActivation] Started listening');
        isListeningRef.current = true;
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        // Don't process results if we're in cooldown or stopped
        if (triggerCooldownRef.current || manualStopRef.current) {
          return;
        }

        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        const fullTranscript = finalTranscript || interimTranscript;
        setLastHeard(fullTranscript);

        // Only check final transcripts to avoid repeated triggers
        if (finalTranscript && checkForTriggerPhrase(finalTranscript)) {
          console.log('[VoiceActivation] Triggering SOS!');
          
          // Set cooldown to prevent repeated triggers
          triggerCooldownRef.current = true;
          
          // Call the trigger callback
          onTriggerRef.current?.();
          
          // Clear the last heard to avoid re-triggering
          setLastHeard("");
          
          // Reset cooldown after 5 seconds
          setTimeout(() => {
            triggerCooldownRef.current = false;
            console.log('[VoiceActivation] Cooldown ended, ready for new triggers');
          }, 5000);
        }
      };

      recognition.onerror = (event: any) => {
        console.error('[VoiceActivation] Error:', event.error);
        
        // Handle specific errors
        if (event.error === 'not-allowed') {
          setPermissionGranted(false);
          shouldRestartRef.current = false;
          isListeningRef.current = false;
          setIsListening(false);
          return;
        }
        
        // For recoverable errors, schedule a restart if we should continue
        if ((event.error === 'no-speech' || event.error === 'aborted' || event.error === 'network') 
            && enabledRef.current 
            && continuousRef.current 
            && shouldRestartRef.current
            && !manualStopRef.current) {
          console.log('[VoiceActivation] Recoverable error, will restart');
          // Don't restart here - let onend handle it
        }
      };

      recognition.onend = () => {
        console.log('[VoiceActivation] Recognition ended');
        isListeningRef.current = false;
        
        // Only restart if we should and haven't been manually stopped
        if (shouldRestartRef.current 
            && enabledRef.current 
            && continuousRef.current 
            && !manualStopRef.current) {
          console.log('[VoiceActivation] Scheduling restart...');
          
          clearRestartTimeout();
          restartTimeoutRef.current = window.setTimeout(() => {
            if (shouldRestartRef.current && enabledRef.current && !manualStopRef.current) {
              console.log('[VoiceActivation] Restarting...');
              try {
                recognition.start();
              } catch (e) {
                console.error('[VoiceActivation] Restart failed:', e);
                setIsListening(false);
                shouldRestartRef.current = false;
              }
            }
          }, 1000); // Wait 1 second before restarting to prevent rapid cycling
        } else {
          setIsListening(false);
          recognitionRef.current = null;
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
      return true;
    } catch (error) {
      console.error('[VoiceActivation] Failed to start:', error);
      isListeningRef.current = false;
      setIsListening(false);
      return false;
    }
  }, [permissionGranted, checkForTriggerPhrase, requestPermission, clearRestartTimeout]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearRestartTimeout();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // Ignore
        }
      }
    };
  }, [clearRestartTimeout]);

  // Stop listening when disabled
  useEffect(() => {
    if (!enabled && isListeningRef.current) {
      stopListening();
    }
  }, [enabled, stopListening]);

  return {
    isSupported,
    isListening,
    permissionGranted,
    lastHeard,
    startListening,
    stopListening,
    requestPermission,
  };
};
