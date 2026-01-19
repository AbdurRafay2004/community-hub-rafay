import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { 
  Clock, 
  Play, 
  Pause, 
  RotateCcw, 
  Check, 
  AlertTriangle, 
  MapPin, 
  Users,
  Bell,
  ChevronRight,
  Timer,
  Shield
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRegisterVoiceCommand } from "@/hooks/useRegisterVoiceCommand";

const CheckInTimer = () => {
  const [duration, setDuration] = useState(30); // minutes
  const [timeLeft, setTimeLeft] = useState(0); // seconds
  const [isRunning, setIsRunning] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [showAlertSent, setShowAlertSent] = useState(false);
  const [destination, setDestination] = useState("");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  const WARNING_THRESHOLD = 60; // 1 minute warning

  // Mock emergency contacts
  const emergencyContacts = [
    { name: "Mom", phone: "+1 555-0123" },
    { name: "Dad", phone: "+1 555-0456" },
  ];

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const sendAlert = useCallback(() => {
    setShowWarning(false);
    setShowAlertSent(true);
    setIsRunning(false);
    setTimeLeft(0);
    
    toast({
      title: "🚨 Alert Sent!",
      description: "Your emergency contacts have been notified.",
      variant: "destructive",
    });
  }, [toast]);

  const startTimer = () => {
    if (duration < 1) return;
    setTimeLeft(duration * 60);
    setIsRunning(true);
    toast({
      title: "Timer Started",
      description: `Check in within ${duration} minutes or your contacts will be alerted.`,
    });
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resumeTimer = () => {
    setIsRunning(true);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(0);
    setShowWarning(false);
  };

  const checkIn = () => {
    setIsRunning(false);
    setTimeLeft(0);
    setShowWarning(false);
    toast({
      title: "✅ Checked In!",
      description: "Great! Your contacts won't be alerted.",
    });
  };

  const extendTime = (minutes: number) => {
    setTimeLeft(prev => prev + minutes * 60);
    setShowWarning(false);
    toast({
      title: "Time Extended",
      description: `Added ${minutes} more minutes.`,
    });
  };

  // Voice commands for Timer
  useRegisterVoiceCommand([
    {
      id: "start-timer",
      keywords: {
        en: ["start timer", "start check in", "set timer"],
        bn: ["টাইমার চালু করো", "চেক ইন শুরু করো"],
      },
      response: {
        en: "Starting check-in timer",
        bn: "চেক-ইন টাইমার চালু করা হচ্ছে",
      },
      action: () => startTimer()
    },
    {
      id: "stop-timer",
      keywords: {
        en: ["stop timer", "cancel check in", "i am safe"],
        bn: ["টাইমার বন্ধ করো", "আমি নিরাপদ"],
      },
      response: {
        en: "Stopping timer",
        bn: "টাইমার বন্ধ করা হচ্ছে",
      },
      action: () => checkIn()
    }
  ]);

  // Timer countdown effect
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            sendAlert();
            return 0;
          }
          // Show warning at threshold
          if (prev === WARNING_THRESHOLD) {
            setShowWarning(true);
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, sendAlert]);

  const progress = timeLeft > 0 ? (timeLeft / (duration * 60)) * 100 : 0;
  const isWarningZone = timeLeft <= WARNING_THRESHOLD && timeLeft > 0;

  const presetDurations = [15, 30, 60, 120];

  return (
    <AppLayout>
      <div className="p-6 max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold flex items-center justify-center gap-2">
            <Timer className="h-6 w-6 text-primary" />
            Check-in Timer
          </h1>
          <p className="text-muted-foreground">
            Set a timer. If you don't check in, we alert your contacts.
          </p>
        </div>

        {/* Timer Display */}
        <Card className={`transition-all ${isWarningZone ? 'border-destructive bg-destructive/5' : ''}`}>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-6">
              {/* Circular Timer */}
              <div className="relative w-48 h-48">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
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
                    stroke={isWarningZone ? "hsl(var(--destructive))" : "hsl(var(--primary))"}
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 45}`}
                    strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
                    className="transition-all duration-1000 ease-linear"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-4xl font-bold ${isWarningZone ? 'text-destructive animate-pulse' : ''}`}>
                    {timeLeft > 0 ? formatTime(timeLeft) : formatTime(duration * 60)}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {isRunning ? (isWarningZone ? "Check in now!" : "remaining") : "ready"}
                  </span>
                </div>
              </div>

              {/* Status Badge */}
              {isRunning && (
                <Badge 
                  variant={isWarningZone ? "destructive" : "secondary"}
                  className="animate-pulse"
                >
                  {isWarningZone ? "⚠️ Check in soon!" : "🟢 Timer Active"}
                </Badge>
              )}

              {/* Controls */}
              <div className="flex gap-3">
                {!isRunning && timeLeft === 0 && (
                  <Button size="lg" onClick={startTimer} className="gap-2">
                    <Play className="h-5 w-5" />
                    Start Timer
                  </Button>
                )}
                
                {isRunning && (
                  <>
                    <Button size="lg" variant="secondary" onClick={pauseTimer}>
                      <Pause className="h-5 w-5" />
                    </Button>
                    <Button size="lg" onClick={checkIn} className="gap-2 bg-green-600 hover:bg-green-700">
                      <Check className="h-5 w-5" />
                      I'm Safe
                    </Button>
                  </>
                )}
                
                {!isRunning && timeLeft > 0 && (
                  <>
                    <Button size="lg" variant="secondary" onClick={resumeTimer}>
                      <Play className="h-5 w-5" />
                    </Button>
                    <Button size="lg" onClick={checkIn} className="gap-2 bg-green-600 hover:bg-green-700">
                      <Check className="h-5 w-5" />
                      I'm Safe
                    </Button>
                    <Button size="lg" variant="outline" onClick={resetTimer}>
                      <RotateCcw className="h-5 w-5" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Duration Settings */}
        {!isRunning && timeLeft === 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                Timer Duration
              </CardTitle>
              <CardDescription>How long until you need to check in?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Preset buttons */}
              <div className="flex flex-wrap gap-2">
                {presetDurations.map((mins) => (
                  <Button
                    key={mins}
                    variant={duration === mins ? "default" : "outline"}
                    size="sm"
                    onClick={() => setDuration(mins)}
                  >
                    {mins < 60 ? `${mins} min` : `${mins / 60} hr`}
                  </Button>
                ))}
              </div>

              {/* Custom slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Custom duration</span>
                  <span className="font-medium">{duration} minutes</span>
                </div>
                <Slider
                  value={[duration]}
                  onValueChange={(value) => setDuration(value[0])}
                  min={5}
                  max={180}
                  step={5}
                />
              </div>

              {/* Optional destination */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Where are you going? (optional)</label>
                <div className="flex gap-2">
                  <Input
                    placeholder="e.g., Coffee shop on Main St"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="flex-1"
                  />
                  <Button variant="outline" size="icon">
                    <MapPin className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Emergency Contacts */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                Alert Recipients
              </CardTitle>
              <Link to="/emergency-contacts">
                <Button variant="ghost" size="sm">
                  Manage <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {emergencyContacts.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {emergencyContacts.map((contact, index) => (
                  <Badge key={index} variant="secondary" className="gap-1">
                    <Bell className="h-3 w-3" />
                    {contact.name}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No contacts added</p>
            )}
          </CardContent>
        </Card>

        {/* How it works */}
        <Card className="bg-muted/30">
          <CardContent className="pt-4">
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              How it works
            </h3>
            <ol className="space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span className="font-bold text-primary">1.</span>
                Set a timer for your expected arrival time
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-primary">2.</span>
                When you arrive safely, tap "I'm Safe"
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-primary">3.</span>
                If you don't check in, your contacts are auto-alerted
              </li>
            </ol>
          </CardContent>
        </Card>

        {/* Quick access to SOS */}
        <Link to="/sos">
          <Card className="border-destructive/30 hover:border-destructive/50 transition-colors cursor-pointer">
            <CardContent className="py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <p className="font-medium">Need Immediate Help?</p>
                  <p className="text-sm text-muted-foreground">Use SOS Panic Button</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Warning Dialog */}
      <Dialog open={showWarning} onOpenChange={setShowWarning}>
        <DialogContent className="sm:max-w-md border-destructive" hideCloseButton>
          <DialogHeader>
            <DialogTitle className="text-center text-destructive flex items-center justify-center gap-2">
              <AlertTriangle className="h-6 w-6 animate-pulse" />
              Time Almost Up!
            </DialogTitle>
            <DialogDescription className="text-center">
              Your contacts will be alerted in {timeLeft} seconds unless you check in.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-3 py-4">
            <Button 
              size="lg" 
              onClick={checkIn}
              className="bg-green-600 hover:bg-green-700 gap-2"
            >
              <Check className="h-5 w-5" />
              I'm Safe - Check In
            </Button>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => extendTime(15)}
              >
                +15 min
              </Button>
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => extendTime(30)}
              >
                +30 min
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Alert Sent Dialog */}
      <Dialog open={showAlertSent} onOpenChange={setShowAlertSent}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-destructive flex items-center justify-center gap-2">
              <Bell className="h-6 w-6" />
              Alert Sent
            </DialogTitle>
            <DialogDescription className="text-center">
              Your emergency contacts have been notified with your last known location.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-3">
            <div className="p-3 rounded-lg bg-muted/50 text-sm">
              <p className="font-medium mb-2">Notified contacts:</p>
              {emergencyContacts.map((contact, index) => (
                <div key={index} className="flex items-center gap-2 text-muted-foreground">
                  <Check className="h-4 w-4 text-green-500" />
                  {contact.name} ({contact.phone})
                </div>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button 
              className="w-full"
              onClick={() => setShowAlertSent(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default CheckInTimer;
