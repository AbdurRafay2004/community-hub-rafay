import { useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";

export type Language = "en" | "bn";

interface VoiceCommand {
  path: string;
  keywords: {
    en: string[];
    bn: string[];
  };
  response: {
    en: string;
    bn: string;
  };
}

// Define SpeechRecognition types since they might not be in the global scope for all setups
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onstart: ((this: SpeechRecognition, ev: Event) => void) | null;
  onend: ((this: SpeechRecognition, ev: Event) => void) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => void) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => void) | null;
}

// Extend Window interface to include SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

const commands: VoiceCommand[] = [
  {
    path: "/dashboard",
    keywords: {
      en: ["dashboard", "home", "main menu"],
      bn: ["ড্যাশবোর্ড", "হোম", "মেনু"],
    },
    response: {
      en: "Going to Dashboard",
      bn: "ড্যাশবোর্ডে যাচ্ছি",
    },
  },
  {
    path: "/sos",
    keywords: {
      en: ["sos", "help", "emergency"],
      bn: ["এসওএস", "সাহায্য", "জরুরি"],
    },
    response: {
      en: "Opening SOS Emergency",
      bn: "জরুরি সেবা খুলছি",
    },
  },
  {
    path: "/map",
    keywords: {
      en: ["map", "location", "where am i"],
      bn: ["ম্যাপ", "মানচিত্র", "অবস্থান"],
    },
    response: {
      en: "Opening Map",
      bn: "ম্যাপ খুলছি",
    },
  },
  {
    path: "/communities",
    keywords: {
      en: ["communities", "groups", "community"],
      bn: ["কমিউনিটি", "গ্রুপ"],
    },
    response: {
      en: "Opening Communities",
      bn: "কমিউনিটি খুলছি",
    },
  },
  {
    path: "/profile",
    keywords: {
      en: ["profile", "account", "settings"],
      bn: ["প্রোফাইল", "একাউন্ট", "সেটিংস"],
    },
    response: {
      en: "Opening Profile",
      bn: "প্রোফাইল খুলছি",
    },
  },
  {
    path: "/emergency-contacts",
    keywords: {
      en: ["contacts", "emergency contacts"],
      bn: ["কন্টাক্ট", "জরুরি নাম্বার"],
    },
    response: {
      en: "Opening Emergency Contacts",
      bn: "জরুরি নাম্বার খুলছি",
    },
  },
];

export function useVoiceAssistant() {
  const [isListening, setIsListening] = useState(false);
  const [language, setLanguage] = useState<Language>("en");
  const [feedback, setFeedback] = useState<string>("");
  const navigate = useNavigate();
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesis>(window.speechSynthesis);

  const speak = useCallback((text: string) => {
    if (synthRef.current.speaking) {
      synthRef.current.cancel();
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === "en" ? "en-US" : "bn-BD";
    synthRef.current.speak(utterance);
  }, [language]);

  const processCommand = useCallback((transcript: string) => {
    const lowerTranscript = transcript.toLowerCase();

    // Check strict matches first
    const matchedCommand = commands.find(cmd =>
      cmd.keywords[language].some(keyword => lowerTranscript.includes(keyword))
    );

    if (matchedCommand) {
      setFeedback(matchedCommand.response[language]);
      speak(matchedCommand.response[language]);
      navigate(matchedCommand.path);
      return true;
    }

    // Fallback response
    const notFoundText = language === "en" ? "Command not understood" : "কমান্ড বোঝা যায়নি";
    setFeedback(notFoundText);
    speak(notFoundText);
    return false;
  }, [language, navigate, speak]);

  const startListening = useCallback(() => {
    if (typeof window === 'undefined') return;

    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = language === "en" ? "en-US" : "bn-BD";

    recognition.onstart = () => {
      setIsListening(true);
      setFeedback(language === "en" ? "Listening..." : "শুনছি...");
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      processCommand(transcript);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
      setFeedback(language === "en" ? "Error listening" : "শুনতে সমস্যা হচ্ছে");
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  }, [language, processCommand]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguage(prev => {
      const newLang = prev === "en" ? "bn" : "en";
      const text = newLang === "en" ? "Language set to English" : "ভাষা বাংলা করা হয়েছে";
      speak(text);
      return newLang;
    });
  }, [speak]);

  return {
    isListening,
    language,
    feedback,
    startListening,
    stopListening,
    toggleLanguage,
    setLanguage
  };
}
