import { useEffect } from "react";
import { Mic, MicOff, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useVoiceAssistant } from "@/hooks/useVoiceAssistant";
import { useAudioFeedback } from "@/hooks/useAudioFeedback";
import { cn } from "@/lib/utils";

export function VoiceAssistant() {
  const {
    isListening,
    language,
    feedback,
    startListening,
    stopListening,
    toggleLanguage
  } = useVoiceAssistant();

  const { playSound } = useAudioFeedback();

  // Play sounds on state changes
  useEffect(() => {
    if (isListening) {
      playSound("listeningStart");
    } else {
      // We don't necessarily want a sound on stop unless it was a success/error,
      // but for now let's keep it simple.
      // playSound("listeningEnd");
    }
  }, [isListening, playSound]);

  const handleToggleListening = () => {
    if (isListening) {
      stopListening();
      playSound("buttonRelease");
    } else {
      playSound("buttonPress");
      startListening();
    }
  };

  const handleLanguageToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    playSound("buttonPress");
    toggleLanguage();
  };

  return (
    <div className="fixed bottom-24 right-4 md:bottom-8 md:right-8 z-50 flex flex-col items-end gap-2">
      {/* Feedback Bubble */}
      {feedback && (isListening || feedback.includes("...")) && (
        <div className="bg-background/90 backdrop-blur-sm border shadow-lg rounded-lg p-3 mb-2 max-w-[200px] text-sm animate-in fade-in slide-in-from-bottom-2">
          <p className="font-medium text-foreground">{feedback}</p>
        </div>
      )}

      <div className="flex gap-2 items-center">
        {/* Language Toggle (Small button next to mic) */}
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 rounded-full shadow-md bg-background/80 backdrop-blur-sm"
          onClick={handleLanguageToggle}
          title={language === "en" ? "Switch to Bangla" : "ইংরেজিতে পরিবর্তন করুন"}
        >
          <Languages className="h-4 w-4" />
          <span className="sr-only">Switch Language</span>
        </Button>

        {/* Main Microphone Button */}
        <Button
          onClick={handleToggleListening}
          size="icon"
          className={cn(
            "h-14 w-14 rounded-full shadow-xl transition-all duration-300",
            isListening
              ? "bg-red-500 hover:bg-red-600 animate-pulse ring-4 ring-red-500/30"
              : "bg-primary hover:bg-primary/90 hover:scale-105"
          )}
          title={isListening ? "Stop Listening" : "Start Voice Assistant"}
        >
          {isListening ? (
            <Mic className="h-6 w-6 text-white" />
          ) : (
            <MicOff className="h-6 w-6 text-primary-foreground" />
          )}
          <span className="sr-only">
            {isListening ? "Stop Voice Assistant" : "Start Voice Assistant"}
          </span>
        </Button>
      </div>
    </div>
  );
}
