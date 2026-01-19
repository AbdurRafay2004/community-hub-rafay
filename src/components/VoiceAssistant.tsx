import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Accessibility, 
  Volume2, 
  Languages, 
  ListChecks,
  ArrowRight,
  Mic,
  MicOff,
  Square
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useVoiceAssistant, Language } from "@/hooks/useVoiceAssistant";
import { useAudioFeedback } from "@/hooks/useAudioFeedback";
import { VoiceCommandSettings } from "@/components/VoiceCommandSettings";
import { cn } from "@/lib/utils";

export function VoiceAssistant() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const { playSound } = useAudioFeedback();

  const {
    state,
    activate,
    deactivate,
    selectLanguage,
    readAllFeatures,
    readFeature,
    navigateToFeature,
    stopSpeaking,
    startListening,
    stopListening,
    features,
    updateCustomCommands,
    customCommands
  } = useVoiceAssistant((path) => {
    playSound("success");
    navigate(path);
    setIsOpen(false);
    deactivate();
  });

  // Handle dialog close
  const handleClose = () => {
    setIsOpen(false);
    deactivate();
  };

  // Handle floating button click
  const handleActivate = useCallback(() => {
    playSound('buttonPress');
    setIsOpen(true);
    activate();
  }, [activate, playSound]);

  // Global double-click listener
  useEffect(() => {
    const handleDoubleClick = () => {
      handleActivate();
    };

    window.addEventListener('dblclick', handleDoubleClick);
    return () => window.removeEventListener('dblclick', handleDoubleClick);
  }, [handleActivate]);

  // Handle language selection
  const handleLanguageSelect = async (lang: Language) => {
    playSound('buttonPress');
    await selectLanguage(lang);
    setTimeout(() => {
      readAllFeatures();
    }, 500);
  };

  // Handle feature navigation
  const handleFeatureClick = (path: string) => {
    playSound('buttonPress');
    navigateToFeature(path);
  };

  // Toggle listening
  const handleToggleListening = () => {
    playSound('buttonPress');
    if (state.isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <>
      {/* Floating Accessibility Button */}
      <button
        onClick={handleActivate}
        className={cn(
          "fixed bottom-24 right-4 md:bottom-8 md:right-8 z-50",
          "w-14 h-14 rounded-full",
          "bg-primary text-primary-foreground",
          "shadow-lg hover:shadow-xl",
          "flex items-center justify-center",
          "transition-all duration-300 hover:scale-110",
          "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
          "animate-pulse-slow"
        )}
        aria-label="Activate Voice Assistant"
        title="Voice Assistant"
      >
        <Accessibility className="w-6 h-6" />
      </button>

      {/* Voice Assistant Dialog */}
      <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Accessibility className="w-6 h-6 text-primary" />
              <span>Voice Assistant</span>
              <span className="text-muted-foreground text-sm font-normal ml-2">
                ভয়েস সহায়ক
              </span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">

            {/* Speaking/Listening Indicators */}
            <div className="space-y-3">
              {state.isSpeaking && (
                <div className="flex items-center justify-between p-4 bg-primary/10 rounded-xl border border-primary/20">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Volume2 className="w-6 h-6 text-primary animate-pulse" />
                      <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-ping" />
                    </div>
                    <span className="text-sm font-medium">Speaking...</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      playSound('buttonPress');
                      stopSpeaking();
                    }}
                    className="text-destructive hover:bg-destructive/10"
                  >
                    <Square className="w-4 h-4 mr-1" />
                    Stop
                  </Button>
                </div>
              )}

              {/* Show listening state */}
              {(state.language || state.isListening) && (
                <div className={cn(
                  "flex items-center justify-between p-4 rounded-xl border transition-colors",
                  state.isListening 
                    ? "bg-green-500/10 border-green-500/30" 
                    : "bg-muted/50 border-border"
                )}>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      {state.isListening ? (
                        <Mic className="w-6 h-6 text-green-500 animate-pulse" />
                      ) : (
                        <MicOff className="w-6 h-6 text-muted-foreground" />
                      )}
                      {state.isListening && (
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-ping" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium">
                          {state.isListening 
                            ? (state.language === "en" ? "Listening..." : "Listening / শুনছি...")
                            : (state.language === "en" ? "Microphone off" : "Microphone off")}
                        </span>
                      </div>
                      {state.lastCommand && (
                        <span className="text-xs text-muted-foreground">
                          Last: "{state.lastCommand}"
                        </span>
                      )}
                    </div>
                  </div>
                  <Button
                    variant={state.isListening ? "destructive" : "default"}
                    size="sm"
                    onClick={handleToggleListening}
                  >
                    {state.isListening ? (
                      <>
                        <MicOff className="w-4 h-4 mr-1" />
                        Stop
                      </>
                    ) : (
                      <>
                        <Mic className="w-4 h-4 mr-1" />
                        Listen
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>

            {/* Voice Commands Help */}
            {state.language && (
              <div className="p-3 bg-accent/10 rounded-lg text-sm border border-accent/20">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-accent-foreground">
                    {state.language === "en" ? "Voice Commands:" : "ভয়েস কমান্ড:"}
                  </p>
                  <VoiceCommandSettings 
                    features={features}
                    onCommandsUpdate={updateCustomCommands}
                    language={state.language}
                  />
                </div>
                <ul className="space-y-1 text-muted-foreground text-xs">
                  <li>• "Go to Dashboard" / "Open SOS" / "Show Map"</li>
                  <li>• "Go to Contacts" / "Check my status"</li>
                  <li>• "Read all features" - {state.language === "en" ? "hear all features" : "সব ফিচার শুনুন"}</li>
                  <li>• "Stop" - {state.language === "en" ? "stop speaking" : "কথা বন্ধ করুন"}</li>
                  {Object.keys(customCommands).length > 0 && (
                    <li className="text-primary">
                      • {state.language === "en" 
                        ? `+ ${Object.values(customCommands).flat().length} custom commands` 
                        : `+ ${Object.values(customCommands).flat().length}টি কাস্টম কমান্ড`}
                    </li>
                  )}
                </ul>
              </div>
            )}

            {/* Language Selection */}
            {!state.language && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-center">
                  Choose Language / ভাষা বেছে নিন
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    onClick={() => handleLanguageSelect("en")}
                    className="h-20 text-lg flex flex-col gap-2"
                    variant="outline"
                  >
                    <Languages className="w-6 h-6" />
                    English
                  </Button>
                  <Button
                    onClick={() => handleLanguageSelect("bn")}
                    className="h-20 text-lg flex flex-col gap-2"
                    variant="outline"
                  >
                    <Languages className="w-6 h-6" />
                    বাংলা
                  </Button>
                </div>
              </div>
            )}

            {/* Features List */}
            {state.language && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <ListChecks className="w-5 h-5 text-primary" />
                    {state.language === "en" ? "Features" : "ফিচার সমূহ"}
                  </h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      playSound('buttonPress');
                      readAllFeatures();
                    }}
                    disabled={state.isSpeaking}
                  >
                    <Volume2 className="w-4 h-4 mr-1" />
                    {state.language === "en" ? "Read All" : "সব পড়ুন"}
                  </Button>
                </div>

                <div className="space-y-2 max-h-[40vh] overflow-y-auto pr-2">
                  {features.map((feature, index) => (
                    <div
                      key={feature.path}
                      className="group flex items-center gap-3 p-3 bg-secondary/50 hover:bg-secondary rounded-xl transition-colors cursor-pointer"
                      onClick={() => handleFeatureClick(feature.path)}
                      onMouseEnter={() => readFeature(index)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === "Enter" && handleFeatureClick(feature.path)}
                    >
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground">
                          {state.language === "en" ? feature.name.en : feature.name.bn}
                        </h4>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {state.language === "en" ? feature.description.en : feature.description.bn}
                        </p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  ))}
                </div>

                {/* Change Language Button */}
                <div className="pt-4 border-t border-border">
                  <Button
                    variant="ghost"
                    className="w-full"
                    onClick={() => {
                      playSound('buttonPress');
                      stopSpeaking();
                      stopListening();
                      deactivate();
                      setTimeout(() => activate(), 100);
                    }}
                  >
                    <Languages className="w-4 h-4 mr-2" />
                    {state.language === "en" ? "Change Language" : "ভাষা পরিবর্তন করুন"}
                  </Button>
                </div>
              </div>
            )}

            {/* Instructions */}
            <div className="text-xs text-muted-foreground text-center space-y-1 pt-4 border-t border-border">
              <p>
                {state.language === "bn"
                  ? "নেভিগেট করতে 'Go to Dashboard' বলুন বা যেকোনো ফিচারে ট্যাপ করুন"
                  : "Say 'Go to Dashboard' or tap any feature to navigate"}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
