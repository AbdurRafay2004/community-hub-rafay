import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { 
  MapPin, 
  Clock, 
  Navigation, 
  Shield, 
  Check, 
  X, 
  AlertTriangle,
  Users,
  Bell,
  Play,
  Pause,
  RotateCcw,
  ChevronLeft
} from "lucide-react";

interface Trip {
  destination: string;
  estimatedMinutes: number;
  startTime: Date;
  endTime: Date;
  isActive: boolean;
}

const SafeArrival = () => {
  const navigate = useNavigate();
  const [destination, setDestination] = useState("");
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(30);
  const [activeTrip, setActiveTrip] = useState<Trip | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [notifyContacts, setNotifyContacts] = useState(true);
  const [autoExtend, setAutoExtend] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Mock emergency contacts
  const emergencyContacts = [
    { name: "Mom", phone: "+1 555-0123" },
    { name: "Dad", phone: "+1 555-0456" },
  ];

  // Calculate total minutes
  const totalMinutes = hours * 60 + minutes;

  // Timer countdown effect
  useEffect(() => {
    if (activeTrip && !isPaused) {
      timerRef.current = setInterval(() => {
        const now = new Date().getTime();
        const end = activeTrip.endTime.getTime();
        const remaining = Math.max(0, Math.floor((end - now) / 1000));
        
        setTimeRemaining(remaining);

        // Time's up - trigger alert
        if (remaining === 0) {
          handleTimeUp();
        }

        // Warning at 5 minutes
        if (remaining === 300) {
          toast.warning("5 minutes remaining! Check in soon.", {
            action: {
              label: "I'm Safe",
              onClick: () => handleArrived(),
            },
          });
        }

        // Warning at 1 minute
        if (remaining === 60) {
          toast.warning("1 minute remaining!", {
            action: {
              label: "I'm Safe",
              onClick: () => handleArrived(),
            },
          });
        }
      }, 1000);

      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }
  }, [activeTrip, isPaused]);

  const handleTimeUp = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    
    if (autoExtend) {
      // Auto-extend by 10 minutes
      const newEndTime = new Date(Date.now() + 10 * 60 * 1000);
      setActiveTrip(prev => prev ? { ...prev, endTime: newEndTime } : null);
      toast.info("Timer auto-extended by 10 minutes");
    } else {
      // Alert emergency contacts
      toast.error("Time's up! Alerting your emergency contacts...", {
        duration: 5000,
      });
      // In production, this would trigger actual alerts
      setTimeout(() => {
        toast.success("Emergency contacts have been notified of your status");
      }, 2000);
    }
  };

  const handleStartTrip = () => {
    if (!destination.trim()) {
      toast.error("Please enter a destination");
      return;
    }
    if (totalMinutes < 5) {
      toast.error("Please set at least 5 minutes");
      return;
    }

    const now = new Date();
    const endTime = new Date(now.getTime() + totalMinutes * 60 * 1000);

    const trip: Trip = {
      destination: destination.trim(),
      estimatedMinutes: totalMinutes,
      startTime: now,
      endTime,
      isActive: true,
    };

    setActiveTrip(trip);
    setTimeRemaining(totalMinutes * 60);
    
    if (notifyContacts) {
      toast.success(`Trip started! Contacts notified: ${emergencyContacts.map(c => c.name).join(", ")}`);
    } else {
      toast.success("Trip started! Check in when you arrive.");
    }
  };

  const handleArrived = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setActiveTrip(null);
    setTimeRemaining(0);
    setDestination("");
    toast.success("Great! You've arrived safely. Contacts have been notified.", {
      icon: <Check className="h-4 w-4" />,
    });
  };

  const handleCancel = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setActiveTrip(null);
    setTimeRemaining(0);
    toast.info("Trip cancelled");
  };

  const handlePauseResume = () => {
    if (isPaused) {
      // Resume - extend end time by paused duration
      const pausedDuration = activeTrip ? activeTrip.endTime.getTime() - Date.now() : 0;
      if (activeTrip && pausedDuration < timeRemaining * 1000) {
        const newEndTime = new Date(Date.now() + timeRemaining * 1000);
        setActiveTrip({ ...activeTrip, endTime: newEndTime });
      }
    }
    setIsPaused(!isPaused);
    toast.info(isPaused ? "Timer resumed" : "Timer paused");
  };

  const handleExtendTime = (extraMinutes: number) => {
    if (!activeTrip) return;
    const newEndTime = new Date(activeTrip.endTime.getTime() + extraMinutes * 60 * 1000);
    setActiveTrip({ ...activeTrip, endTime: newEndTime });
    setTimeRemaining(prev => prev + extraMinutes * 60);
    toast.success(`Extended by ${extraMinutes} minutes`);
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = activeTrip 
    ? (timeRemaining / (activeTrip.estimatedMinutes * 60)) * 100 
    : 0;

  return (
    <AppLayout>
      <div className="p-6 max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              Safe Arrival
            </h1>
            <p className="text-muted-foreground text-sm">
              Set a destination and ETA - we'll alert contacts if you don't check in
            </p>
          </div>
        </div>

        {activeTrip ? (
          /* Active Trip View */
          <div className="space-y-6">
            {/* Timer Display */}
            <Card className={`border-2 ${timeRemaining < 300 ? 'border-destructive bg-destructive/5' : 'border-primary'}`}>
              <CardContent className="pt-6 text-center space-y-4">
                <div className="flex items-center justify-center gap-2">
                  <Navigation className="h-5 w-5 text-muted-foreground" />
                  <span className="text-lg font-medium">{activeTrip.destination}</span>
                </div>
                
                <div className={`text-6xl font-mono font-bold ${timeRemaining < 60 ? 'text-destructive animate-pulse' : ''}`}>
                  {formatTime(timeRemaining)}
                </div>

                <Progress value={progressPercentage} className="h-2" />

                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Expected by {activeTrip.endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>

                {isPaused && (
                  <Badge variant="secondary" className="animate-pulse">
                    <Pause className="h-3 w-3 mr-1" /> Paused
                  </Badge>
                )}
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <Button 
                size="lg" 
                className="h-20 text-lg bg-green-600 hover:bg-green-700"
                onClick={handleArrived}
              >
                <Check className="h-6 w-6 mr-2" />
                I'm Safe
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="h-20 text-lg"
                onClick={handlePauseResume}
              >
                {isPaused ? (
                  <>
                    <Play className="h-6 w-6 mr-2" />
                    Resume
                  </>
                ) : (
                  <>
                    <Pause className="h-6 w-6 mr-2" />
                    Pause
                  </>
                )}
              </Button>
            </div>

            {/* Extend Time Options */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Need more time?</CardTitle>
              </CardHeader>
              <CardContent className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleExtendTime(5)}>
                  +5 min
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleExtendTime(10)}>
                  +10 min
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleExtendTime(15)}>
                  +15 min
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleExtendTime(30)}>
                  +30 min
                </Button>
              </CardContent>
            </Card>

            {/* Cancel Button */}
            <Button 
              variant="ghost" 
              className="w-full text-muted-foreground"
              onClick={handleCancel}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel Trip
            </Button>
          </div>
        ) : (
          /* Setup New Trip View */
          <div className="space-y-6">
            {/* Destination Input */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  Where are you going?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Input 
                  placeholder="e.g., Home, Work, Sarah's house..."
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="text-lg"
                />
              </CardContent>
            </Card>

            {/* Time Estimation */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  Expected arrival time
                </CardTitle>
                <CardDescription>How long until you arrive?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Hours</Label>
                    <Input 
                      type="number"
                      min={0}
                      max={24}
                      value={hours}
                      onChange={(e) => setHours(Math.max(0, parseInt(e.target.value) || 0))}
                      className="text-center text-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Minutes</Label>
                    <Input 
                      type="number"
                      min={0}
                      max={59}
                      value={minutes}
                      onChange={(e) => setMinutes(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                      className="text-center text-lg"
                    />
                  </div>
                </div>

                {/* Quick Time Options */}
                <div className="flex flex-wrap gap-2">
                  {[15, 30, 45, 60, 90].map((mins) => (
                    <Button 
                      key={mins}
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setHours(Math.floor(mins / 60));
                        setMinutes(mins % 60);
                      }}
                    >
                      {mins >= 60 ? `${mins / 60}h` : `${mins}m`}
                    </Button>
                  ))}
                </div>

                <p className="text-sm text-muted-foreground">
                  You'll need to check in within <strong>{totalMinutes} minutes</strong>
                </p>
              </CardContent>
            </Card>

            {/* Settings */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Trip Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Bell className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-sm">Notify contacts on start</p>
                      <p className="text-xs text-muted-foreground">Let them know you're on your way</p>
                    </div>
                  </div>
                  <Switch checked={notifyContacts} onCheckedChange={setNotifyContacts} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <RotateCcw className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-sm">Auto-extend on timeout</p>
                      <p className="text-xs text-muted-foreground">Add 10 min before alerting</p>
                    </div>
                  </div>
                  <Switch checked={autoExtend} onCheckedChange={setAutoExtend} />
                </div>
              </CardContent>
            </Card>

            {/* Contacts Preview */}
            <Card className="bg-muted/30">
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Contacts to alert</p>
                    <p className="text-xs text-muted-foreground">
                      {emergencyContacts.map(c => c.name).join(", ")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Start Button */}
            <Button 
              size="lg" 
              className="w-full h-14 text-lg"
              onClick={handleStartTrip}
              disabled={!destination.trim() || totalMinutes < 5}
            >
              <Navigation className="h-5 w-5 mr-2" />
              Start Safe Trip
            </Button>

            {/* Info Note */}
            <div className="flex gap-3 p-4 rounded-lg bg-amber-500/10 border border-amber-500/30">
              <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />
              <p className="text-sm text-muted-foreground">
                If you don't check in by your expected arrival time, your emergency contacts will be automatically notified with your last known location.
              </p>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default SafeArrival;
