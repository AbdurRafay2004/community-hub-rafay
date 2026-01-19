import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { AlertTriangle, X, MapPin, Phone, MessageSquare, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAudioFeedback } from "@/hooks/useAudioFeedback";

interface SOSButtonProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  onTrigger?: () => void;
}

const SOSButton = ({ size = "lg", className = "", onTrigger }: SOSButtonProps) => {
  const [isPressed, setIsPressed] = useState(false);
  const [pressProgress, setPressProgress] = useState(0);
  const [showCountdown, setShowCountdown] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [alertSent, setAlertSent] = useState(false);
  const pressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();
  const { playSound } = useAudioFeedback();

  const HOLD_DURATION = 3000;
  const COUNTDOWN_DURATION = 10;

  const sizeClasses = {
    sm: "w-16 h-16 text-sm",
    md: "w-24 h-24 text-base",
    lg: "w-32 h-32 text-lg"
  };

  const clearAllTimers = useCallback(() => {
    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current);
      pressTimerRef.current = null;
    }
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
  }, []);

  const sendSOSAlert = useCallback(() => {
    setAlertSent(true);
    playSound('alertSent');
    toast({
      title: "🚨 SOS Alert Sent!",
      description: "Your emergency contacts have been notified with your location.",
      variant: "destructive",
    });

    setTimeout(() => {
      setShowCountdown(false);
      setAlertSent(false);
      setCountdown(COUNTDOWN_DURATION);
    }, 3000);
  }, [toast, playSound]);

  const startCountdown = useCallback(() => {
    setShowCountdown(true);
    setCountdown(COUNTDOWN_DURATION);
    playSound('notification');

    countdownIntervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownIntervalRef.current!);
          sendSOSAlert();
          return 0;
        }
        // Play tick sound for each countdown
        playSound('countdownTick');
        return prev - 1;
      });
    }, 1000);
  }, [sendSOSAlert, playSound]);

  const triggerSOS = useCallback(() => {
    startCountdown();
    onTrigger?.();
  }, [startCountdown, onTrigger]);

  useEffect(() => {
    (window as any).__triggerSOS = triggerSOS;
    return () => {
      delete (window as any).__triggerSOS;
    };
  }, [triggerSOS]);

  const handlePressStart = useCallback(() => {
    setIsPressed(true);
    setPressProgress(0);
    playSound('buttonPress');

    const startTime = Date.now();
    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / HOLD_DURATION) * 100, 100);
      setPressProgress(progress);

      if (progress >= 100) {
        clearInterval(progressIntervalRef.current!);
      }
    }, 50);

    pressTimerRef.current = setTimeout(() => {
      setIsPressed(false);
      setPressProgress(0);
      clearInterval(progressIntervalRef.current!);
      startCountdown();
    }, HOLD_DURATION);
  }, [startCountdown, playSound]);

  const handlePressEnd = useCallback(() => {
    setIsPressed(false);
    setPressProgress(0);
    playSound('buttonRelease');
    
    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current);
      pressTimerRef.current = null;
    }
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  }, [playSound]);

  const cancelSOS = useCallback(() => {
    clearAllTimers();
    setShowCountdown(false);
    setCountdown(COUNTDOWN_DURATION);
    playSound('alertCancelled');
    toast({
      title: "SOS Cancelled",
      description: "Emergency alert has been cancelled.",
    });
  }, [clearAllTimers, toast, playSound]);

  useEffect(() => {
    return () => clearAllTimers();
  }, [clearAllTimers]);

  return (
    <>
      <div className={`relative ${className}`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`absolute rounded-full bg-destructive/20 animate-ping ${sizeClasses[size]}`} 
               style={{ animationDuration: '2s' }} />
          <div className={`absolute rounded-full bg-destructive/10 ${sizeClasses[size]}`}
               style={{ transform: 'scale(1.2)' }} />
        </div>

        <svg 
          className={`absolute transform -rotate-90 ${sizeClasses[size]}`}
          viewBox="0 0 100 100"
        >
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="hsl(var(--destructive) / 0.3)"
            strokeWidth="4"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="hsl(var(--destructive))"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 45}`}
            strokeDashoffset={`${2 * Math.PI * 45 * (1 - pressProgress / 100)}`}
            className="transition-all duration-100"
          />
        </svg>

        <button
          onMouseDown={handlePressStart}
          onMouseUp={handlePressEnd}
          onMouseLeave={handlePressEnd}
          onTouchStart={handlePressStart}
          onTouchEnd={handlePressEnd}
          className={`relative z-10 ${sizeClasses[size]} rounded-full bg-destructive hover:bg-destructive/90 
                     text-destructive-foreground font-bold flex flex-col items-center justify-center 
                     transition-all duration-200 shadow-lg
                     ${isPressed ? 'scale-95 shadow-xl' : 'hover:scale-105'}`}
          style={{
            boxShadow: isPressed 
              ? '0 0 40px hsl(var(--destructive) / 0.6), inset 0 2px 10px rgba(0,0,0,0.3)' 
              : '0 4px 20px hsl(var(--destructive) / 0.4)'
          }}
        >
          <Shield className={size === "sm" ? "h-5 w-5" : size === "md" ? "h-7 w-7" : "h-10 w-10"} />
          <span className="font-extrabold tracking-wider mt-1">SOS</span>
        </button>

        <p className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-muted-foreground whitespace-nowrap">
          Hold for 3 seconds
        </p>
      </div>

      <Dialog open={showCountdown} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md border-destructive" hideCloseButton>
          <DialogHeader>
            <DialogTitle className="text-center text-destructive flex items-center justify-center gap-2">
              <AlertTriangle className="h-6 w-6 animate-pulse" />
              {alertSent ? "Alert Sent!" : "SOS Alert Countdown"}
            </DialogTitle>
            <DialogDescription className="text-center">
              {alertSent 
                ? "Your emergency contacts have been notified."
                : "Alert will be sent automatically. Press cancel to stop."}
            </DialogDescription>
          </DialogHeader>

          {!alertSent ? (
            <div className="flex flex-col items-center py-6 space-y-6">
              <div className="relative">
                <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="hsl(var(--muted))"
                    strokeWidth="6"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="hsl(var(--destructive))"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 45}`}
                    strokeDashoffset={`${2 * Math.PI * 45 * (1 - countdown / COUNTDOWN_DURATION)}`}
                    className="transition-all duration-1000 ease-linear"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-5xl font-bold text-destructive">{countdown}</span>
                </div>
              </div>

              <div className="w-full space-y-2 text-sm">
                <p className="font-medium text-center mb-3">Sending to your emergency contacts:</p>
                <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>Your current GPS location</span>
                </div>
                <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                  <MessageSquare className="h-4 w-4 text-primary" />
                  <span>Pre-set emergency message</span>
                </div>
                <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                  <Phone className="h-4 w-4 text-primary" />
                  <span>SMS & In-app notification</span>
                </div>
              </div>

              <Button 
                variant="outline" 
                size="lg" 
                onClick={cancelSOS}
                className="w-full border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
              >
                <X className="h-5 w-5 mr-2" />
                Cancel SOS ({countdown}s)
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center py-8 space-y-4">
              <div className="w-20 h-20 rounded-full bg-destructive/20 flex items-center justify-center">
                <Shield className="h-10 w-10 text-destructive" />
              </div>
              <p className="text-center text-muted-foreground">
                Stay calm. Help is on the way.
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SOSButton;
