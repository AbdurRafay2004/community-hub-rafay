import { useState, useCallback, useRef, useEffect } from "react";

export type Language = "en" | "bn";

// Declare speech recognition types
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

export interface WebsiteFeature {
  name: {
    en: string;
    bn: string;
  };
  description: {
    en: string;
    bn: string;
  };
  path: string;
  voiceCommands: string[]; // Keywords to trigger navigation
}

export interface CustomVoiceCommands {
  [featurePath: string]: string[];
}

// Define all website features for the assistant to read
const websiteFeatures: WebsiteFeature[] = [
  {
    name: { en: "Dashboard", bn: "ড্যাশবোর্ড" },
    description: {
      en: "View your community overview, recent activities, and quick access to all features",
      bn: "আপনার কমিউনিটির সারসংক্ষেপ, সাম্প্রতিক কার্যকলাপ এবং সব ফিচারে দ্রুত প্রবেশ দেখুন"
    },
    path: "/dashboard",
    voiceCommands: ["dashboard", "go to dashboard", "open dashboard", "show dashboard", "check my status", "my status", "status", "ড্যাশবোর্ড"]
  },
  {
    name: { en: "Communities", bn: "কমিউনিটি" },
    description: {
      en: "Join or create communities to connect with people in your area",
      bn: "আপনার এলাকার মানুষদের সাথে সংযুক্ত হতে কমিউনিটিতে যোগ দিন বা তৈরি করুন"
    },
    path: "/communities",
    voiceCommands: ["communities", "go to communities", "open communities", "show communities", "my communities", "কমিউনিটি"]
  },
  {
    name: { en: "SOS Emergency Button", bn: "এসওএস জরুরি বাটন" },
    description: {
      en: "Send emergency alerts to your contacts with your location. You can activate it by voice command saying Help Me Now, by shaking your phone, or by pressing the panic button",
      bn: "আপনার অবস্থান সহ আপনার পরিচিতদের কাছে জরুরি সতর্কতা পাঠান। আপনি হেল্প মি নাউ বলে ভয়েস কমান্ড দিয়ে, ফোন ঝাঁকিয়ে বা প্যানিক বাটন চেপে এটি সক্রিয় করতে পারেন"
    },
    path: "/sos",
    voiceCommands: ["sos", "go to sos", "open sos", "emergency", "panic", "go to emergency", "open emergency", "help me", "i need help", "এসওএস", "জরুরি"]
  },
  {
    name: { en: "Emergency Contacts", bn: "জরুরি যোগাযোগ" },
    description: {
      en: "Manage your emergency contacts who will be notified during emergencies",
      bn: "আপনার জরুরি পরিচিতি পরিচালনা করুন যাদের জরুরি অবস্থায় জানানো হবে"
    },
    path: "/emergency-contacts",
    voiceCommands: ["emergency contacts", "go to emergency contacts", "open emergency contacts", "contacts", "go to contacts", "my contacts", "show contacts", "জরুরি যোগাযোগ"]
  },
  {
    name: { en: "Check-in Timer", bn: "চেক-ইন টাইমার" },
    description: {
      en: "Set a timer that will automatically alert your contacts if you don't check in",
      bn: "একটি টাইমার সেট করুন যা আপনি চেক-ইন না করলে স্বয়ংক্রিয়ভাবে আপনার পরিচিতদের সতর্ক করবে"
    },
    path: "/check-in",
    voiceCommands: ["check in", "check-in", "timer", "go to check in", "open check in", "set timer", "checkin", "চেক-ইন"]
  },
  {
    name: { en: "Safe Arrival", bn: "নিরাপদ আগমন" },
    description: {
      en: "Share your journey with trusted contacts who can track your safe arrival",
      bn: "বিশ্বস্ত পরিচিতদের সাথে আপনার যাত্রা শেয়ার করুন যারা আপনার নিরাপদ আগমন ট্র্যাক করতে পারবে"
    },
    path: "/safe-arrival",
    voiceCommands: ["safe arrival", "go to safe arrival", "open safe arrival", "arrival", "track journey", "share journey", "নিরাপদ আগমন"]
  },
  {
    name: { en: "Fake Call", bn: "ভুয়া কল" },
    description: {
      en: "Schedule a fake phone call to help you exit uncomfortable situations",
      bn: "অস্বস্তিকর পরিস্থিতি থেকে বের হতে সাহায্য করার জন্য একটি ভুয়া ফোন কল নির্ধারণ করুন"
    },
    path: "/fake-call",
    voiceCommands: ["fake call", "go to fake call", "open fake call", "escape call", "pretend call", "ভুয়া কল"]
  },
  {
    name: { en: "Notices", bn: "নোটিশ" },
    description: {
      en: "View and create community notices and announcements",
      bn: "কমিউনিটি নোটিশ এবং ঘোষণা দেখুন এবং তৈরি করুন"
    },
    path: "/notices",
    voiceCommands: ["notices", "go to notices", "open notices", "announcements", "show notices", "নোটিশ"]
  },
  {
    name: { en: "Chat", bn: "চ্যাট" },
    description: {
      en: "Message with community members directly",
      bn: "সরাসরি কমিউনিটির সদস্যদের সাথে বার্তা পাঠান"
    },
    path: "/chat",
    voiceCommands: ["chat", "go to chat", "open chat", "messages", "messaging", "send message", "চ্যাট"]
  },
  {
    name: { en: "Map View", bn: "ম্যাপ ভিউ" },
    description: {
      en: "View community locations and nearby resources on a map",
      bn: "মানচিত্রে কমিউনিটির অবস্থান এবং কাছাকাছি সম্পদ দেখুন"
    },
    path: "/map",
    voiceCommands: ["map", "go to map", "open map", "map view", "show map", "location", "where am i", "ম্যাপ"]
  },
  {
    name: { en: "Profile", bn: "প্রোফাইল" },
    description: {
      en: "Manage your personal profile and settings",
      bn: "আপনার ব্যক্তিগত প্রোফাইল এবং সেটিংস পরিচালনা করুন"
    },
    path: "/profile",
    voiceCommands: ["profile", "go to profile", "open profile", "my profile", "settings", "my settings", "প্রোফাইল"]
  },
  {
    name: { en: "Notifications", bn: "নোটিফিকেশন" },
    description: {
      en: "View all your notifications and alerts",
      bn: "আপনার সমস্ত নোটিফিকেশন এবং সতর্কতা দেখুন"
    },
    path: "/notifications",
    voiceCommands: ["notifications", "go to notifications", "open notifications", "alerts", "show alerts", "নোটিফিকেশন"]
  },
  {
    name: { en: "Home", bn: "হোম" },
    description: {
      en: "Go back to the home page",
      bn: "হোম পেজে ফিরে যান"
    },
    path: "/",
    voiceCommands: ["home", "go to home", "go home", "open home", "main page", "হোম"]
  }
];

interface VoiceAssistantState {
  isActive: boolean;
  isSpeaking: boolean;
  isListening: boolean;
  language: Language | null;
  currentStep: "greeting" | "language_selection" | "reading_features" | "navigation" | "idle";
  error: string | null;
  lastCommand: string | null;
}

interface UseVoiceAssistantReturn {
  state: VoiceAssistantState;
  activate: () => void;
  deactivate: () => void;
  selectLanguage: (lang: Language) => void;
  readAllFeatures: () => void;
  readFeature: (index: number) => void;
  navigateToFeature: (path: string) => void;
  speak: (text: string, lang?: Language) => Promise<void>;
  stopSpeaking: () => void;
  startListening: () => void;
  stopListening: () => void;
  features: WebsiteFeature[];
  updateCustomCommands: (commands: CustomVoiceCommands) => void;
  customCommands: CustomVoiceCommands;
}

export function useVoiceAssistant(onNavigate?: (path: string) => void): UseVoiceAssistantReturn {
  const [state, setState] = useState<VoiceAssistantState>({
    isActive: false,
    isSpeaking: false,
    isListening: false,
    language: null,
    currentStep: "idle",
    error: null,
    lastCommand: null
  });

  const [customCommands, setCustomCommands] = useState<CustomVoiceCommands>({});

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const abortRef = useRef(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Internal state refs to avoid stale closures inside recognition callbacks
  const isListeningRef = useRef(false);
  const desiredListeningRef = useRef(false); // what the user/UI wants
  const isStartingRef = useRef(false);
  const activeRef = useRef(false);
  const stepRef = useRef<VoiceAssistantState["currentStep"]>("idle");
  const speakingRef = useRef(false);
  const restartAttemptsRef = useRef(0);

  useEffect(() => {
    activeRef.current = state.isActive;
    stepRef.current = state.currentStep;
    speakingRef.current = state.isSpeaking;
  }, [state.isActive, state.currentStep, state.isSpeaking]);

  // Check if speech synthesis and recognition are supported
  const isTTSSupported = typeof window !== "undefined" && "speechSynthesis" in window;
  const isSTTSupported = typeof window !== "undefined" && 
    ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);

  // Update custom commands
  const updateCustomCommands = useCallback((commands: CustomVoiceCommands) => {
    setCustomCommands(commands);
  }, []);

  // Find matching feature from voice command (includes custom commands)
  const findFeatureByVoiceCommand = useCallback((transcript: string): WebsiteFeature | null => {
    const lowerTranscript = transcript.toLowerCase().trim();
    
    for (const feature of websiteFeatures) {
      // Check default commands
      for (const command of feature.voiceCommands) {
        if (lowerTranscript.includes(command.toLowerCase())) {
          return feature;
        }
      }
      // Check custom commands
      const featureCustomCommands = customCommands[feature.path] || [];
      for (const command of featureCustomCommands) {
        if (lowerTranscript.includes(command.toLowerCase())) {
          return feature;
        }
      }
    }
    return null;
  }, [customCommands]);

  // Stop any ongoing speech
  const stopSpeaking = useCallback(() => {
    if (isTTSSupported) {
      window.speechSynthesis.cancel();
      setState(prev => ({ ...prev, isSpeaking: false }));
    }
    abortRef.current = true;
  }, [isTTSSupported]);

  // Stop listening
  const stopListening = useCallback(() => {
    desiredListeningRef.current = false;
    isListeningRef.current = false;
    isStartingRef.current = false;

    const rec = recognitionRef.current;
    recognitionRef.current = null;

    if (rec) {
      try {
        // abort() is more reliable than stop() across browsers when we want to end immediately
        rec.abort();
      } catch {
        try {
          rec.stop();
        } catch {
          // ignore
        }
      }
    }

    setState((prev) => ({ ...prev, isListening: false }));
  }, []);

  // Start listening for voice commands
  const startListening = useCallback(() => {
    if (!isSTTSupported) {
      console.warn("Speech recognition not supported");
      return;
    }

    // Mark user's intent first (so onend can auto-restart)
    desiredListeningRef.current = true;

    // Don't start if already starting/listening
    if (isStartingRef.current || isListeningRef.current) return;

    // Don't start while speaking
    if (speakingRef.current) return;

    const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognitionClass();

    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = state.language === "bn" ? "bn-BD" : "en-US";

    recognition.onstart = () => {
      isStartingRef.current = false;
      isListeningRef.current = true;
      restartAttemptsRef.current = 0;
      setState((prev) => ({ ...prev, isListening: true, error: null }));
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const lastResultIndex = event.results.length - 1;
      const transcript = event.results[lastResultIndex][0].transcript;

      console.log("Voice command received:", transcript);
      setState((prev) => ({ ...prev, lastCommand: transcript }));

      const lowerTranscript = transcript.toLowerCase();

      // "Stop / cancel" voice commands
      if (
        lowerTranscript.includes("stop") ||
        lowerTranscript.includes("cancel") ||
        lowerTranscript.includes("shut up") ||
        lowerTranscript.includes("থামো") ||
        lowerTranscript.includes("থামুন") ||
        lowerTranscript.includes("বন্ধ")
      ) {
        stopSpeaking();
        stopListening();
        return;
      }

      // Check for navigation commands
      const matchedFeature = findFeatureByVoiceCommand(transcript);
      if (matchedFeature) {
        stopListening();
        navigateToFeature(matchedFeature.path);
        return;
      }

      // Check for "read all" command
      if (
        lowerTranscript.includes("read all") ||
        lowerTranscript.includes("read features") ||
        lowerTranscript.includes("সব পড়ুন")
      ) {
        stopListening();
        readAllFeatures();
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error("Speech recognition error:", event.error);
      isStartingRef.current = false;
      isListeningRef.current = false;

      // Fatal / user-action-required errors -> stop trying
      if (
        event.error === "not-allowed" ||
        event.error === "service-not-allowed" ||
        event.error === "audio-capture"
      ) {
        desiredListeningRef.current = false;
        setState((prev) => ({ ...prev, error: event.error, isListening: false }));
        return;
      }

      // Non-fatal errors (no-speech/network/etc.) will be handled by onend auto-restart.
      setState((prev) => ({ ...prev, error: event.error }));
    };

    recognition.onend = () => {
      isStartingRef.current = false;
      isListeningRef.current = false;

      const shouldAutoRestart =
        desiredListeningRef.current &&
        activeRef.current &&
        stepRef.current === "navigation" &&
        !abortRef.current;

      if (!shouldAutoRestart) {
        setState((prev) => ({ ...prev, isListening: false }));
        return;
      }

      // Keep UI in "Listening" state while we attempt to restart.
      setState((prev) => ({ ...prev, isListening: true }));

      restartAttemptsRef.current += 1;
      const attempt = restartAttemptsRef.current;

      // Exponential backoff; cap to avoid tight loops on browsers that block background restarts
      const delay = Math.min(2500, 250 * Math.pow(2, attempt - 1));

      // After several failures, stop (avoids infinite loops on Brave when WebSpeech returns network errors)
      if (attempt >= 7) {
        desiredListeningRef.current = false;
        setState((prev) => ({
          ...prev,
          isListening: false,
          error: prev.error || "network",
        }));
        return;
      }

      window.setTimeout(() => {
        if (!desiredListeningRef.current) return;
        if (!activeRef.current) return;
        if (stepRef.current !== "navigation") return;
        if (speakingRef.current) return;
        if (isStartingRef.current || isListeningRef.current) return;

        // Some browsers require user gesture for recognition.start(). If this throws,
        // we stop auto-retrying and ask the user to tap Listen again.
        try {
          isStartingRef.current = true;
          recognitionRef.current = recognition;
          recognition.start();
        } catch (e) {
          console.error("Failed to restart recognition:", e);
          desiredListeningRef.current = false;
          isStartingRef.current = false;
          setState((prev) => ({ ...prev, isListening: false, error: "not-allowed" }));
        }
      }, delay);
    };

    recognitionRef.current = recognition;

    try {
      isStartingRef.current = true;
      recognition.start();
    } catch (error) {
      console.error("Failed to start recognition:", error);
      isStartingRef.current = false;
      desiredListeningRef.current = false;
      setState((prev) => ({ ...prev, isListening: false, error: "not-allowed" }));
    }
  }, [isSTTSupported, state.language, findFeatureByVoiceCommand, stopListening, stopSpeaking]);

  // Speak text in the specified language
  const speak = useCallback(async (text: string, lang: Language = "en"): Promise<void> => {
    if (!isTTSSupported) {
      console.warn("Text-to-speech not supported");
      return;
    }

    abortRef.current = false;
    
    // Stop listening while speaking
    stopListening();

    return new Promise((resolve, reject) => {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utteranceRef.current = utterance;

      // Set language
      utterance.lang = lang === "bn" ? "bn-BD" : "en-US";
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;

      // Try to find a suitable voice
      const voices = window.speechSynthesis.getVoices();
      const targetVoice = voices.find(v => 
        v.lang.startsWith(lang === "bn" ? "bn" : "en")
      );
      if (targetVoice) {
        utterance.voice = targetVoice;
      }

      utterance.onstart = () => {
        setState(prev => ({ ...prev, isSpeaking: true }));
      };

      utterance.onend = () => {
        setState(prev => ({ ...prev, isSpeaking: false }));
        resolve();
        // Resume listening after speaking
        if (state.isActive && state.currentStep === "navigation") {
          setTimeout(() => startListening(), 300);
        }
      };

      utterance.onerror = (event) => {
        if (abortRef.current) {
          resolve(); // Don't treat abort as error
          return;
        }
        setState(prev => ({ ...prev, isSpeaking: false, error: event.error }));
        reject(new Error(event.error));
      };

      window.speechSynthesis.speak(utterance);
    });
  }, [isTTSSupported, state.isActive, state.currentStep, stopListening, startListening]);

  // Navigate to a feature - defined before readAllFeatures
  const navigateToFeature = useCallback(async (path: string) => {
    const lang = state.language || "en";
    const feature = websiteFeatures.find(f => f.path === path);
    
    if (feature) {
      const navMessage = lang === "en"
        ? `Navigating to ${feature.name.en}`
        : `${feature.name.bn} এ যাচ্ছি`;

      await speak(navMessage, lang);
    }

    if (onNavigate) {
      onNavigate(path);
    }
  }, [state.language, speak, onNavigate]);

  // Read all features
  const readAllFeatures = useCallback(async () => {
    const lang = state.language || "en";
    setState(prev => ({ ...prev, currentStep: "reading_features" }));

    const introMessage = lang === "en"
      ? `This application has ${websiteFeatures.length} main features. Let me tell you about each one.`
      : `এই অ্যাপ্লিকেশনে ${websiteFeatures.length}টি প্রধান ফিচার আছে। আমি আপনাকে প্রতিটি সম্পর্কে বলছি।`;

    await speak(introMessage, lang);

    if (abortRef.current) return;

    for (let i = 0; i < websiteFeatures.length; i++) {
      if (abortRef.current) break;

      const feature = websiteFeatures[i];
      const featureText = lang === "en"
        ? `Feature ${i + 1}: ${feature.name.en}. ${feature.description.en}.`
        : `ফিচার ${i + 1}: ${feature.name.bn}। ${feature.description.bn}।`;

      await speak(featureText, lang);
      
      // Small pause between features
      if (!abortRef.current && i < websiteFeatures.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    if (!abortRef.current) {
      const endMessage = lang === "en"
        ? "Those are all the features. You can say Go to followed by a feature name to navigate, or tap on any feature button."
        : "এগুলো সব ফিচার। আপনি Go to বলে ফিচারের নাম বলতে পারেন নেভিগেট করতে, বা যেকোনো ফিচার বাটনে ট্যাপ করতে পারেন।";

      await speak(endMessage, lang);
      setState(prev => ({ ...prev, currentStep: "navigation" }));
    }
  }, [state.language, speak]);

  // Bilingual greeting and language selection
  const greetAndAskLanguage = useCallback(async () => {
    setState(prev => ({ ...prev, currentStep: "greeting" }));
    
    // Greeting in both languages
    await speak("Welcome to Community Compass. আপনাকে কমিউনিটি কম্পাসে স্বাগতম।", "en");
    
    if (abortRef.current) return;
    
    setState(prev => ({ ...prev, currentStep: "language_selection" }));
    
    // Ask for language preference in both languages
    await speak(
      "Please choose your language. Say English or Bangla. " +
      "অনুগ্রহ করে আপনার ভাষা বেছে নিন। ইংরেজি বা বাংলা বলুন।",
      "en"
    );
  }, [speak]);

  // Activate the voice assistant
  const activate = useCallback(() => {
    setState(prev => ({
      ...prev,
      isActive: true,
      error: null,
      currentStep: "greeting",
      lastCommand: null
    }));
    
    greetAndAskLanguage();
  }, [greetAndAskLanguage]);

  // Deactivate the voice assistant
  const deactivate = useCallback(() => {
    stopSpeaking();
    stopListening();
    abortRef.current = true;
    setState({
      isActive: false,
      isSpeaking: false,
      isListening: false,
      language: null,
      currentStep: "idle",
      error: null,
      lastCommand: null
    });
  }, [stopSpeaking, stopListening]);

  // Select language and start listening
  const selectLanguage = useCallback(async (lang: Language) => {
    setState(prev => ({ ...prev, language: lang, currentStep: "navigation" }));

    const confirmMessage = lang === "en"
      ? "You have selected English. You can now say commands like Go to Dashboard or Open SOS to navigate. I will also tell you about all the features."
      : "আপনি বাংলা নির্বাচন করেছেন। আপনি এখন Go to Dashboard বা Open SOS এর মত কমান্ড বলতে পারেন নেভিগেট করতে। আমি আপনাকে সব ফিচার সম্পর্কেও বলব।";

    await speak(confirmMessage, lang);
  }, [speak]);

  // Read a specific feature
  const readFeature = useCallback(async (index: number) => {
    const lang = state.language || "en";
    const feature = websiteFeatures[index];
    
    if (!feature) return;

    const featureText = lang === "en"
      ? `${feature.name.en}. ${feature.description.en}.`
      : `${feature.name.bn}। ${feature.description.bn}।`;

    await speak(featureText, lang);
  }, [state.language, speak]);

  // Load voices when available
  useEffect(() => {
    if (isTTSSupported) {
      const loadVoices = () => {
        window.speechSynthesis.getVoices();
      };
      
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, [isTTSSupported]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isTTSSupported) {
        window.speechSynthesis.cancel();
      }
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [isTTSSupported]);

  return {
    state,
    activate,
    deactivate,
    selectLanguage,
    readAllFeatures,
    readFeature,
    navigateToFeature,
    speak,
    stopSpeaking,
    startListening,
    stopListening,
    features: websiteFeatures,
    updateCustomCommands,
    customCommands
  };
}
