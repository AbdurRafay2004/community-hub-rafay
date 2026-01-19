import { useEffect, useState } from "react";
import { Mic, Waves } from "lucide-react";
import { cn } from "@/lib/utils";

interface WakeWordOverlayProps {
  isVisible: boolean;
  onComplete: () => void;
}

export function WakeWordOverlay({ isVisible, onComplete }: WakeWordOverlayProps) {
  const [phase, setPhase] = useState<"enter" | "pulse" | "exit">("enter");

  useEffect(() => {
    if (isVisible) {
      setPhase("enter");
      
      // Transition to pulse after entrance animation
      const pulseTimeout = setTimeout(() => {
        setPhase("pulse");
      }, 300);

      // Start exit after showing
      const exitTimeout = setTimeout(() => {
        setPhase("exit");
      }, 1200);

      // Complete after exit animation
      const completeTimeout = setTimeout(() => {
        onComplete();
      }, 1600);

      return () => {
        clearTimeout(pulseTimeout);
        clearTimeout(exitTimeout);
        clearTimeout(completeTimeout);
      };
    }
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-[100] flex items-center justify-center bg-background/95 backdrop-blur-md transition-all duration-300",
        phase === "enter" && "animate-fade-in",
        phase === "exit" && "animate-fade-out opacity-0"
      )}
    >
      {/* Animated rings */}
      <div className="relative">
        {/* Outer ring 1 */}
        <div
          className={cn(
            "absolute inset-0 w-48 h-48 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2",
            "rounded-full border-2 border-primary/30",
            phase === "pulse" && "animate-ping"
          )}
          style={{ animationDuration: "1.5s" }}
        />
        
        {/* Outer ring 2 */}
        <div
          className={cn(
            "absolute inset-0 w-40 h-40 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2",
            "rounded-full border-2 border-primary/40",
            phase === "pulse" && "animate-ping"
          )}
          style={{ animationDuration: "1.2s", animationDelay: "0.2s" }}
        />

        {/* Outer ring 3 */}
        <div
          className={cn(
            "absolute inset-0 w-32 h-32 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2",
            "rounded-full border-2 border-primary/50",
            phase === "pulse" && "animate-ping"
          )}
          style={{ animationDuration: "1s", animationDelay: "0.4s" }}
        />

        {/* Center icon container */}
        <div
          className={cn(
            "relative w-24 h-24 rounded-full bg-primary flex items-center justify-center",
            "shadow-lg shadow-primary/40",
            phase === "enter" && "animate-scale-in",
            phase === "pulse" && "animate-pulse"
          )}
        >
          <Mic className="w-10 h-10 text-primary-foreground" />
        </div>
      </div>

      {/* Text */}
      <div
        className={cn(
          "absolute bottom-1/3 text-center",
          phase === "enter" && "animate-slide-up"
        )}
      >
        <div className="flex items-center gap-2 mb-2 justify-center">
          <Waves className="w-5 h-5 text-primary animate-pulse" />
          <span className="text-lg font-semibold text-foreground">
            Wake Word Detected
          </span>
          <Waves className="w-5 h-5 text-primary animate-pulse" />
        </div>
        <p className="text-muted-foreground text-sm">
          "Hey Assistant" heard - Activating voice commands...
        </p>
      </div>
    </div>
  );
}