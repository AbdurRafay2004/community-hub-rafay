import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Accessibility, 
  Volume2, 
  Languages, 
  ListChecks,
  ArrowRight,
  Mic,
  MicOff,
  Square,
  Radio,
  WifiOff
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useVoiceAssistant, Language, CustomVoiceCommands } from "@/hooks/useVoiceAssistant";
import { useAudioLevel } from "@/hooks/useAudioLevel";
import { useWakeWord } from "@/hooks/useWakeWord";
import { useAudioFeedback } from "@/hooks/useAudioFeedback";
import { VoiceCommandSettings } from "@/components/VoiceCommandSettings";
import { WakeWordOverlay } from "@/components/WakeWordOverlay";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

// Audio level visualizer component
function AudioLevelIndicator({ level, isActive }: { level: number; isActive: boolean }) {
  const bars = 5;
  
  return (
    <div className="flex items-end gap-1 h-6">
      {Array.from({ length: bars }).map((_, i) => {
        const threshold = (i + 1) * (100 / bars);
        const isLit = isActive && level >= threshold - (100 / bars);
        const height = 8 + (i * 4);
        
        return (
          <div
            key={i}
            className={cn(
              "w-1 rounded-full transition-all duration-75",
              isLit 
                ? level > 70 
                  ? "bg-red-500" 
                  : level > 40 
                    ? "bg-yellow-500" 
                    : "bg-green-500"
                : "bg-muted-foreground/30"
            )}
            style={{ height: `${height}px` }}
          />
        );
      })}
    </div>
  );
}

export function VoiceAssistant() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [doublePressTimer, setDoublePressTimer] = useState<NodeJS.Timeout | null>(null);
  const [pressCount, setPressCount] = useState(0);
  const [wakeWordEnabled, setWakeWordEnabled] = useState(false);
  const [showWakeWordOverlay, setShowWakeWordOverlay] = useState(false);
  const [audioMeterEnabled, setAudioMeterEnabled] = useState(false);
  const [showDebug, setShowDebug] = useState(false);

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

  const audioLevel = useAudioLevel();

  // Handle wake word overlay complete
  const handleWakeWordOverlayComplete = useCallback(() => {
    setShowWakeWordOverlay(false);
    setIsOpen(true);
    activate();
  }, [activate]);

  // Wake word detection - "Hey Assistant"
  // IMPORTANT: `enabled` here should NOT depend on `wakeWordEnabled`, otherwise we create a circular flow:
  // - wakeWordEnabled starts false
  // - startPassiveListening() refuses to start when enabled is false
  // - wakeWordEnabled never becomes true
  const wakeWord = useWakeWord({
    wakeWords: ["hey assistant", "hi assistant", "ok assistant", "hello assistant", "hey সহায়ক"],
    // Only disable when the dialog/overlay is shown (we explicitly start/stop via the button)
    enabled: !isOpen && !showWakeWordOverlay,
    onWake: useCallback(() => {
      playSound("wakeWord");
      // Show the overlay first
      setShowWakeWordOverlay(true);
    }, [playSound]),
  });

  // Determine if audio meter can safely run (no mic conflicts)
  const canRunAudioMeter = audioMeterEnabled && !state.isListening && !wakeWordEnabled && !wakeWord.isListening;

  // Start/stop audio meter based on safe conditions
  useEffect(() => {
    if (canRunAudioMeter && !audioLevel.isActive) {
      audioLevel.startMonitoring();
    } else if (!canRunAudioMeter && audioLevel.isActive) {
      audioLevel.stopMonitoring();
    }
  }, [canRunAudioMeter, audioLevel]);

  // NOTE: Avoid competing microphone streams.
  // WebSpeech (SpeechRecognition) already uses the microphone.
  // Starting a separate getUserMedia() stream for audio level monitoring can cause
  // rapid connect/disconnect (especially on mobile/Brave), and can make recognition stop instantly.
  // The audio meter toggle above only activates when wake word + listening are both off.


  // Handle double-press of 'A' key to activate
  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (e.key.toLowerCase() === 'a' && !e.ctrlKey && !e.metaKey && !e.altKey) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      setPressCount(prev => prev + 1);

      if (doublePressTimer) {
        clearTimeout(doublePressTimer);
      }

      const timer = setTimeout(() => {
        setPressCount(0);
      }, 500);

      setDoublePressTimer(timer);
    }
  }, [doublePressTimer]);

  // Check for double press
  useEffect(() => {
    if (pressCount >= 2) {
      setPressCount(0);
      playSound('notification');
      setIsOpen(true);
      activate();
    }
  }, [pressCount, activate, playSound]);

  // Listen for keyboard shortcut
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  // Handle dialog close
  const handleClose = () => {
    setIsOpen(false);
    deactivate();
  };

  // Handle floating button click
  const handleActivate = () => {
    playSound('buttonPress');
    setIsOpen(true);
    activate();
  };

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

  // Toggle wake word listening
  const handleToggleWakeWord = async () => {
    playSound('buttonPress');
    if (wakeWordEnabled) {
      wakeWord.stopPassiveListening();
      setWakeWordEnabled(false);
      toast({
        title: "Wake Word Disabled",
        description: "Say 'Hey Assistant' is no longer being monitored.",
      });
    } else {
      const started = await wakeWord.startPassiveListening();
      if (started) {
        setWakeWordEnabled(true);
        toast({
          title: "Wake Word Enabled",
          description: "Say 'Hey Assistant' anytime to activate voice commands.",
        });
      } else {
        toast({
          title: "Microphone Access Required",
          description: "Please allow microphone access to use wake word detection.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <>
      {/* Wake Word Overlay */}
      <WakeWordOverlay 
        isVisible={showWakeWordOverlay} 
        onComplete={handleWakeWordOverlayComplete} 
      />

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
          wakeWordEnabled ? "ring-2 ring-green-500 ring-offset-2" : "animate-pulse-slow"
        )}
        aria-label="Activate Voice Assistant - Press A twice to activate"
        title={wakeWordEnabled ? "Voice Assistant (Listening for 'Hey Assistant')" : "Voice Assistant (Press A twice)"}
      >
        <Accessibility className="w-6 h-6" />
        {wakeWordEnabled && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-ping" />
        )}
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
            {/* Debug Toggle */}
            <div className="flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDebug(!showDebug)}
                className="text-xs text-muted-foreground"
              >
                {showDebug ? "Hide Debug" : "Show Debug"}
              </Button>
            </div>

            {/* Debug Panel */}
            {showDebug && (
              <div className="p-3 bg-muted/50 rounded-lg border text-xs font-mono space-y-1">
                <p className="font-semibold text-foreground mb-2">🔧 Voice Debug Panel</p>
                <p>SpeechRecognition: <span className={wakeWord.isSupported ? "text-green-500" : "text-red-500"}>{wakeWord.isSupported ? "✓ Supported" : "✗ Not Supported"}</span></p>
                <p>Wake Word Enabled (UI): <span className={wakeWordEnabled ? "text-green-500" : "text-yellow-500"}>{wakeWordEnabled ? "Yes" : "No"}</span></p>
                <p>Wake Word Listening: <span className={wakeWord.isListening ? "text-green-500" : "text-yellow-500"}>{wakeWord.isListening ? "Yes" : "No"}</span></p>
                <p>Wake Word Active: <span className={wakeWord.isActive ? "text-green-500" : "text-yellow-500"}>{wakeWord.isActive ? "Yes" : "No"}</span></p>
                <p>Dialog Open: {isOpen ? "Yes" : "No"}</p>
                <p>STT Listening: <span className={state.isListening ? "text-green-500" : "text-yellow-500"}>{state.isListening ? "Yes" : "No"}</span></p>
                <p>TTS Speaking: <span className={state.isSpeaking ? "text-blue-500" : "text-muted-foreground"}>{state.isSpeaking ? "Yes" : "No"}</span></p>
                <p>Last Heard (Wake): <span className="text-muted-foreground">{wakeWord.lastHeard || "(none)"}</span></p>
                <p>Last Command: <span className="text-muted-foreground">{state.lastCommand || "(none)"}</span></p>
                {state.error && <p className="text-red-500">Error: {state.error}</p>}
              </div>
            )}

            {/* Wake Word Toggle */}
            <div className={cn(
              "flex items-center justify-between p-4 rounded-xl border transition-colors",
              !wakeWord.isSupported
                ? "bg-red-500/10 border-red-500/30"
                : wakeWordEnabled && wakeWord.isListening
                  ? "bg-green-500/10 border-green-500/30" 
                  : wakeWordEnabled && !wakeWord.isListening
                    ? "bg-yellow-500/10 border-yellow-500/30"
                    : "bg-muted/50 border-border"
            )}>
              <div className="flex items-center gap-3">
              {!wakeWord.isSupported ? (
                <WifiOff className="w-5 h-5 text-red-500" />
              ) : wakeWordEnabled && wakeWord.isListening ? (
                <Radio className="w-5 h-5 text-green-500 animate-pulse" />
              ) : wakeWordEnabled ? (
                <Radio className="w-5 h-5 text-yellow-500" />
              ) : (
                <WifiOff className="w-5 h-5 text-muted-foreground" />
              )}
                <div>
                  <p className="font-medium text-sm">
                    {!wakeWord.isSupported 
                      ? "Wake Word Not Supported"
                      : wakeWordEnabled && wakeWord.isListening
                        ? "Wake Word Listening..."
                        : wakeWordEnabled && !wakeWord.isListening
                          ? "Wake Word Starting..."
                          : "Wake Word Inactive"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {!wakeWord.isSupported 
                      ? "Your browser doesn't support SpeechRecognition"
                      : "Say \"Hey Assistant\" to activate"}
                  </p>
                </div>
              </div>
              <Button
                variant={wakeWordEnabled ? "destructive" : "default"}
                size="sm"
                onClick={handleToggleWakeWord}
                disabled={!wakeWord.isSupported}
              >
                {wakeWordEnabled ? "Disable" : "Enable"}
              </Button>
            </div>

            {/* Audio Meter Toggle - Only when not conflicting with mic */}
            <div className={cn(
              "flex items-center justify-between p-3 rounded-lg border transition-colors",
              audioMeterEnabled 
                ? canRunAudioMeter
                  ? "bg-blue-500/10 border-blue-500/30" 
                  : "bg-yellow-500/10 border-yellow-500/30"
                : "bg-muted/30 border-border"
            )}>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <AudioLevelIndicator 
                    level={audioLevel.audioLevel} 
                    isActive={audioLevel.isActive} 
                  />
                </div>
                <div>
                  <p className="font-medium text-xs">
                    Audio Meter {audioMeterEnabled ? (canRunAudioMeter ? "(Active)" : "(Paused)") : "(Off)"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {audioMeterEnabled && !canRunAudioMeter 
                      ? "Paused: mic in use" 
                      : "Visual mic level indicator"}
                  </p>
                </div>
              </div>
              <Button
                variant={audioMeterEnabled ? "outline" : "secondary"}
                size="sm"
                onClick={() => {
                  playSound('buttonPress');
                  setAudioMeterEnabled(!audioMeterEnabled);
                }}
                className="text-xs h-7"
              >
                {audioMeterEnabled ? "Off" : "On"}
              </Button>
            </div>

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

              {state.language && (
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
                            ? (state.language === "en" ? "Listening..." : "শুনছি...") 
                            : (state.language === "en" ? "Microphone off" : "মাইক্রোফোন বন্ধ")}
                        </span>
                        {state.isListening && audioMeterEnabled && canRunAudioMeter && (
                          <AudioLevelIndicator 
                            level={audioLevel.audioLevel} 
                            isActive={audioLevel.isActive} 
                          />
                        )}
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
            {state.currentStep === "language_selection" && !state.language && (
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
                {state.language === "en" 
                  ? "Say 'Go to Dashboard' or tap any feature to navigate"
                  : "নেভিগেট করতে 'Go to Dashboard' বলুন বা যেকোনো ফিচারে ট্যাপ করুন"}
              </p>
              <p className="text-muted-foreground/70">
                Keyboard: Press 'A' twice | Wake word: "Hey Assistant"
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
