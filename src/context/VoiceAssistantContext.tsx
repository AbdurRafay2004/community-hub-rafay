import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";

export type Language = "en" | "bn";

export interface VoiceCommand {
  id?: string;
  keywords: {
    en: string[];
    bn: string[];
  };
  response?: {
    en: string;
    bn: string;
  };
  action?: () => void;
  path?: string;
}

interface VoiceAssistantContextType {
  isListening: boolean;
  language: Language;
  feedback: string;
  startListening: () => void;
  stopListening: () => void;
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
  registerCommand: (command: VoiceCommand) => () => void;
}

const VoiceAssistantContext = createContext<VoiceAssistantContextType | undefined>(undefined);

// Extensive default commands for navigation
const initialCommands: VoiceCommand[] = [
  // Dashboard & Home
  {
    path: "/dashboard",
    keywords: {
      en: ["dashboard", "home", "main menu", "go to dashboard"],
      bn: ["ড্যাশবোর্ড", "হোম", "মেনু", "ড্যাশবোর্ডে যাও"],
    },
    response: {
      en: "Going to Dashboard",
      bn: "ড্যাশবোর্ডে যাচ্ছি",
    },
  },
  {
    path: "/",
    keywords: {
      en: ["index", "landing page", "start page"],
      bn: ["ইনডেক্স", "শুরুর পাতা"],
    },
    response: {
      en: "Going to Home",
      bn: "হোমে যাচ্ছি",
    },
  },

  // Emergency Features
  {
    path: "/sos",
    keywords: {
      en: ["sos", "help", "emergency", "open sos", "panic button"],
      bn: ["এসওএস", "সাহায্য", "জরুরি", "এসওএস খোল", "প্যানিক বাটন"],
    },
    response: {
      en: "Opening SOS Emergency",
      bn: "জরুরি সেবা খুলছি",
    },
  },
  {
    path: "/emergency-contacts",
    keywords: {
      en: ["contacts", "emergency contacts", "my contacts", "phone numbers"],
      bn: ["কন্টাক্ট", "জরুরি নাম্বার", "ফোন নম্বর"],
    },
    response: {
      en: "Opening Emergency Contacts",
      bn: "জরুরি নাম্বার খুলছি",
    },
  },
  {
    path: "/emergency-alerts",
    keywords: {
      en: ["alerts", "emergency alerts", "warnings", "show alerts"],
      bn: ["সতর্কতা", "এলার্ট", "সতর্কবার্তা"],
    },
    response: {
      en: "Opening Emergency Alerts",
      bn: "জরুরি সতর্কতা খুলছি",
    },
  },
  {
    path: "/fake-call",
    keywords: {
      en: ["fake call", "pretend call", "simulate call"],
      bn: ["ফেক কল", "ভুয়া কল"],
    },
    response: {
      en: "Opening Fake Call",
      bn: "ফেক কল খুলছি",
    },
  },
  {
    path: "/check-in",
    keywords: {
      en: ["check in", "timer", "safety timer", "check-in"],
      bn: ["চেক ইন", "টাইমার", "সেফটি টাইমার"],
    },
    response: {
      en: "Opening Check-in Timer",
      bn: "চেক-ইন টাইমার খুলছি",
    },
  },
  {
    path: "/safe-arrival",
    keywords: {
      en: ["safe arrival", "track me", "journey tracking"],
      bn: ["নিরাপদ পৌঁছানো", "ট্র্যাক করো", "জার্নি ট্র্যাকিং"],
    },
    response: {
      en: "Opening Safe Arrival",
      bn: "সেফ অ্যারাইভাল খুলছি",
    },
  },

  // Community Features
  {
    path: "/communities",
    keywords: {
      en: ["communities", "groups", "community list", "find groups"],
      bn: ["কমিউনিটি", "গ্রুপ", "কমিউনিটি তালিকা"],
    },
    response: {
      en: "Opening Communities",
      bn: "কমিউনিটি খুলছি",
    },
  },
  {
    path: "/create-community",
    keywords: {
      en: ["create community", "new group", "start community"],
      bn: ["কমিউনিটি তৈরি", "নতুন গ্রুপ", "কমিউনিটি বানাও"],
    },
    response: {
      en: "Opening Create Community",
      bn: "কমিউনিটি তৈরির পেজ খুলছি",
    },
  },
  {
    path: "/join-community",
    keywords: {
      en: ["join community", "join group"],
      bn: ["কমিউনিটিতে যোগ দিন", "গ্রুপে যোগ দিন"],
    },
    response: {
      en: "Opening Join Community",
      bn: "কমিউনিটিতে যোগদানের পেজ খুলছি",
    },
  },
  {
    path: "/map",
    keywords: {
      en: ["map", "location", "where am i", "nearby"],
      bn: ["ম্যাপ", "মানচিত্র", "অবস্থান", "কাছাকাছি"],
    },
    response: {
      en: "Opening Map",
      bn: "ম্যাপ খুলছি",
    },
  },

  // Communication
  {
    path: "/chat",
    keywords: {
      en: ["chat", "messages", "inbox", "conversation"],
      bn: ["চ্যাট", "মেসেজ", "বার্তা", "কথপোকথন"],
    },
    response: {
      en: "Opening Chat",
      bn: "চ্যাট খুলছি",
    },
  },
  {
    path: "/notices",
    keywords: {
      en: ["notices", "announcements", "news", "bulletin"],
      bn: ["নোটিশ", "ঘোষণা", "খবর"],
    },
    response: {
      en: "Opening Notices",
      bn: "নোটিশ খুলছি",
    },
  },
  {
    path: "/create-notice",
    keywords: {
      en: ["create notice", "post announcement", "new notice"],
      bn: ["নোটিশ তৈরি", "ঘোষণা দিন", "নতুন নোটিশ"],
    },
    response: {
      en: "Opening Create Notice",
      bn: "নোটিশ তৈরির পেজ খুলছি",
    },
  },

  // User Profile & Settings
  {
    path: "/profile",
    keywords: {
      en: ["profile", "account", "my info"],
      bn: ["প্রোফাইল", "একাউন্ট", "আমার তথ্য"],
    },
    response: {
      en: "Opening Profile",
      bn: "প্রোফাইল খুলছি",
    },
  },
  {
    path: "/edit-profile",
    keywords: {
      en: ["edit profile", "change details", "update profile"],
      bn: ["প্রোফাইল এডিট", "তথ্য পরিবর্তন"],
    },
    response: {
      en: "Opening Edit Profile",
      bn: "প্রোফাইল এডিট খুলছি",
    },
  },
  {
    path: "/notifications",
    keywords: {
      en: ["notifications", "updates", "activity"],
      bn: ["নোটিফিকেশন", "আপডেট", "অ্যাক্টিভিটি"],
    },
    response: {
      en: "Opening Notifications",
      bn: "নোটিফিকেশন খুলছি",
    },
  },

  // Auth
  {
    path: "/login",
    keywords: {
      en: ["login", "sign in", "log in"],
      bn: ["লগইন", "সাইন ইন"],
    },
    response: {
      en: "Opening Login",
      bn: "লগইন পেজ খুলছি",
    },
  },
  {
    path: "/register",
    keywords: {
      en: ["register", "sign up", "create account"],
      bn: ["রেজিস্টার", "সাইন আপ", "অ্যাকাউন্ট খুলুন"],
    },
    response: {
      en: "Opening Registration",
      bn: "রেজিস্ট্রেশন পেজ খুলছি",
    },
  },

  // Misc
  {
    path: "/surveys",
    keywords: {
      en: ["surveys", "polls", "questions"],
      bn: ["জরিপ", "পোল", "প্রশ্ন"],
    },
    response: {
      en: "Opening Surveys",
      bn: "জরিপ খুলছি",
    },
  },
  {
    path: "/create-survey",
    keywords: {
      en: ["create survey", "new poll"],
      bn: ["জরিপ তৈরি", "নতুন পোল"],
    },
    response: {
      en: "Opening Create Survey",
      bn: "জরিপ তৈরির পেজ খুলছি",
    },
  },
  {
    path: "/search",
    keywords: {
      en: ["search", "find"],
      bn: ["অনুসন্ধান", "খোঁজ"],
    },
    response: {
      en: "Opening Search",
      bn: "অনুসন্ধান খুলছি",
    },
  }
];

export function VoiceAssistantProvider({ children }: { children: React.ReactNode }) {
  const [isListening, setIsListening] = useState(false);
  const [language, setLanguage] = useState<Language>("en");
  const [feedback, setFeedback] = useState<string>("");
  const [dynamicCommands, setDynamicCommands] = useState<VoiceCommand[]>([]);

  const navigate = useNavigate();
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesis>(window.speechSynthesis);

  // Combine static and dynamic commands
  const allCommands = React.useMemo(() => [...initialCommands, ...dynamicCommands], [dynamicCommands]);

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

    // Find matching command
    // We sort commands by keyword length (descending) to match more specific phrases first
    // This helps avoid partial matches (e.g. "go to dashboard" matching just "dashboard")
    const sortedCommands = [...allCommands].sort((a, b) => {
       // Get max keyword length for current language
       const maxA = Math.max(...a.keywords[language].map(k => k.length));
       const maxB = Math.max(...b.keywords[language].map(k => k.length));
       return maxB - maxA;
    });

    const matchedCommand = sortedCommands.find(cmd =>
      cmd.keywords[language].some(keyword => lowerTranscript.includes(keyword.toLowerCase()))
    );

    if (matchedCommand) {
      // Prioritize action over navigation if both exist (though usually exclusive)
      if (matchedCommand.response) {
        setFeedback(matchedCommand.response[language]);
        speak(matchedCommand.response[language]);
      } else {
        setFeedback(language === "en" ? "Executing command..." : "কমান্ড কার্যকর হচ্ছে...");
      }

      if (matchedCommand.action) {
        matchedCommand.action();
      }

      if (matchedCommand.path) {
        navigate(matchedCommand.path);
      }

      return true;
    }

    // Fallback response
    const notFoundText = language === "en" ? "Command not understood" : "কমান্ড বোঝা যায়নি";
    setFeedback(notFoundText);
    speak(notFoundText);
    return false;
  }, [allCommands, language, navigate, speak]);

  const startListening = useCallback(() => {
    if (typeof window === 'undefined') return;

    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    // If already started, don't start again
    if (recognitionRef.current) {
        try {
            recognitionRef.current.stop();
        } catch(e) { /* ignore */ }
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    // We might want continuous for "extensive use", but simpler "one-shot" is more reliable for now.
    // User can double-click to talk again.
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
      // Don't show error feedback for "no-speech" or "aborted" to avoid annoyance
      if (event.error !== 'no-speech' && event.error !== 'aborted') {
         setFeedback(language === "en" ? "Error listening" : "শুনতে সমস্যা হচ্ছে");
      } else {
         setFeedback("");
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  }, [language, processCommand]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
    setFeedback("");
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguage(prev => {
      const newLang = prev === "en" ? "bn" : "en";
      const text = newLang === "en" ? "Language set to English" : "ভাষা বাংলা করা হয়েছে";
      speak(text);
      return newLang;
    });
  }, [speak]);

  // Command registration
  const registerCommand = useCallback((command: VoiceCommand) => {
    // Generate a unique ID if not provided, to help with unregistering (though object ref works too)
    const cmdWithId = { ...command, id: command.id || Math.random().toString(36).substr(2, 9) };

    setDynamicCommands(prev => [...prev, cmdWithId]);

    // Return cleanup function
    return () => {
      setDynamicCommands(prev => prev.filter(c => c.id !== cmdWithId.id));
    };
  }, []);

  // Double-click listener
  useEffect(() => {
    const handleDoubleClick = () => {
      if (isListening) {
        stopListening();
      } else {
        startListening();
      }
    };

    window.addEventListener("dblclick", handleDoubleClick);
    return () => window.removeEventListener("dblclick", handleDoubleClick);
  }, [isListening, startListening, stopListening]);

  return (
    <VoiceAssistantContext.Provider
      value={{
        isListening,
        language,
        feedback,
        startListening,
        stopListening,
        toggleLanguage,
        setLanguage,
        registerCommand
      }}
    >
      {children}
    </VoiceAssistantContext.Provider>
  );
}

export function useVoiceAssistantContext() {
  const context = useContext(VoiceAssistantContext);
  if (!context) {
    throw new Error("useVoiceAssistantContext must be used within a VoiceAssistantProvider");
  }
  return context;
}
