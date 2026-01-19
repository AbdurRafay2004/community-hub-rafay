import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import SOSButton from "@/components/SOSButton";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useShakeDetection } from "@/hooks/useShakeDetection";
import { useVoiceActivation } from "@/hooks/useVoiceActivation";
import { toast } from "sonner";
import { 
  Settings, 
  Users, 
  Smartphone, 
  Mic, 
  Hand, 
  Volume2, 
  Eye, 
  EyeOff,
  ChevronRight,
  MapPin,
  Clock,
  MessageSquare,
  AlertTriangle,
  Timer,
  Phone,
  Vibrate,
  MicOff
} from "lucide-react";

const SOSPage = () => {
  const [silentMode, setSilentMode] = useState(false);
  const [shakeToTrigger, setShakeToTrigger] = useState(true);
  const [voiceCommand, setVoiceCommand] = useState(false);
  const [liveTracking, setLiveTracking] = useState(true);

  // Shake detection hook
  const { 
    isSupported: shakeSupported, 
    permissionGranted: shakePermission,
    isListening: shakeListening,
    requestPermission: requestShakePermission 
  } = useShakeDetection({
    threshold: 20,
    shakeCount: 3,
    timeout: 1500,
    enabled: shakeToTrigger,
    onShake: () => {
      if ((window as any).__triggerSOS) {
        toast.warning("Shake detected! SOS triggered...");
        (window as any).__triggerSOS();
      }
    },
  });

  // Voice activation hook
  const {
    isSupported: voiceSupported,
    isListening: voiceListening,
    permissionGranted: voicePermission,
    lastHeard,
    startListening: startVoiceListening,
    stopListening: stopVoiceListening,
    requestPermission: requestVoicePermission,
  } = useVoiceActivation({
    triggerPhrase: "help me now",
    enabled: voiceCommand,
    onTrigger: () => {
      if ((window as any).__triggerSOS) {
        toast.warning("Voice command detected! SOS triggered...");
        (window as any).__triggerSOS();
      }
    },
  });

  // Request shake permission when enabled
  useEffect(() => {
    if (shakeToTrigger && shakeSupported && !shakePermission) {
      requestShakePermission();
    }
  }, [shakeToTrigger, shakeSupported, shakePermission, requestShakePermission]);

  // Handle voice command toggle
  const handleVoiceToggle = useCallback(async (checked: boolean) => {
    setVoiceCommand(checked);
    
    if (checked && voiceSupported) {
      if (!voicePermission) {
        const granted = await requestVoicePermission();
        if (granted) {
          // Small delay to ensure permission is fully processed
          setTimeout(() => {
            startVoiceListening();
          }, 500);
        } else {
          setVoiceCommand(false);
          toast.error("Microphone permission denied");
        }
      } else {
        // Small delay to ensure state is updated
        setTimeout(() => {
          startVoiceListening();
        }, 100);
      }
    } else {
      stopVoiceListening();
    }
  }, [voiceSupported, voicePermission, requestVoicePermission, startVoiceListening, stopVoiceListening]);

  // Mock data for emergency contacts
  const emergencyContacts = [
    { name: "Mom", phone: "+1 555-0123" },
    { name: "Dad", phone: "+1 555-0456" },
    { name: "Best Friend", phone: "+1 555-0789" },
  ];

  return (
    <AppLayout>
      <div className="p-6 max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Emergency SOS</h1>
          <p className="text-muted-foreground">
            Instantly alert your emergency contacts
          </p>
        </div>

        {/* Main SOS Button */}
        <div className="flex justify-center py-8">
          <SOSButton size="lg" />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-3 rounded-lg bg-muted/50">
            <Users className="h-5 w-5 mx-auto mb-1 text-primary" />
            <p className="text-2xl font-bold">{emergencyContacts.length}</p>
            <p className="text-xs text-muted-foreground">Contacts</p>
          </div>
          <div className="p-3 rounded-lg bg-muted/50">
            <MapPin className="h-5 w-5 mx-auto mb-1 text-primary" />
            <p className="text-2xl font-bold">GPS</p>
            <p className="text-xs text-muted-foreground">Tracking</p>
          </div>
          <div className="p-3 rounded-lg bg-muted/50">
            <Clock className="h-5 w-5 mx-auto mb-1 text-primary" />
            <p className="text-2xl font-bold">10s</p>
            <p className="text-xs text-muted-foreground">Countdown</p>
          </div>
        </div>

        {/* Emergency Contacts Card */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                Emergency Contacts
              </CardTitle>
              <Link to="/emergency-contacts">
                <Button variant="ghost" size="sm">
                  Manage <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {emergencyContacts.length > 0 ? (
              emergencyContacts.map((contact, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-2 rounded-lg bg-muted/30"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">
                        {contact.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">{contact.name}</p>
                      <p className="text-xs text-muted-foreground">{contact.phone}</p>
                    </div>
                  </div>
                  {index === 0 && (
                    <Badge variant="secondary" className="text-xs">Primary</Badge>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-4">
                <p className="text-muted-foreground text-sm mb-2">No contacts added yet</p>
                <Link to="/emergency-contacts">
                  <Button size="sm">Add Contacts</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Trigger Methods */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Smartphone className="h-4 w-4 text-primary" />
              Trigger Methods
            </CardTitle>
            <CardDescription>Choose how to activate SOS</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                  <Hand className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium text-sm">Long Press</p>
                  <p className="text-xs text-muted-foreground">Hold button for 3 seconds</p>
                </div>
              </div>
              <Badge variant="outline" className="text-xs">Always On</Badge>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  shakeToTrigger && shakeListening ? 'bg-green-500/20' : 'bg-muted'
                }`}>
                  <Vibrate className={`h-5 w-5 ${
                    shakeToTrigger && shakeListening ? 'text-green-500' : 'text-muted-foreground'
                  }`} />
                </div>
                <div>
                  <p className="font-medium text-sm">Shake Phone</p>
                  <p className="text-xs text-muted-foreground">
                    {!shakeSupported 
                      ? "Not supported on this device"
                      : shakeToTrigger && shakeListening 
                        ? "Active - Shake 3 times to trigger"
                        : "Shake 3 times rapidly"}
                  </p>
                </div>
              </div>
              <Switch 
                checked={shakeToTrigger} 
                onCheckedChange={(checked) => {
                  setShakeToTrigger(checked);
                  if (checked && shakeSupported && !shakePermission) {
                    requestShakePermission();
                  }
                }}
                disabled={!shakeSupported}
              />
            </div>

            {shakeToTrigger && shakeSupported && !shakePermission && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={requestShakePermission}
                className="ml-13"
              >
                <Vibrate className="h-4 w-4 mr-2" />
                Enable Motion Access
              </Button>
            )}

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  voiceCommand && voiceListening ? 'bg-green-500/20' : 'bg-muted'
                }`}>
                  {voiceCommand && voiceListening ? (
                    <Mic className="h-5 w-5 text-green-500 animate-pulse" />
                  ) : (
                    <MicOff className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-sm">Voice Command</p>
                  <p className="text-xs text-muted-foreground">
                    {!voiceSupported 
                      ? "Not supported on this browser"
                      : voiceCommand && voiceListening 
                        ? "Listening for 'Help me now'"
                        : "Say 'Help me now' to trigger"}
                  </p>
                </div>
              </div>
              <Switch 
                checked={voiceCommand} 
                onCheckedChange={handleVoiceToggle}
                disabled={!voiceSupported}
              />
            </div>

            {voiceCommand && voiceSupported && !voicePermission && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => requestVoicePermission().then(granted => {
                  if (granted) startVoiceListening();
                })}
                className="ml-13"
              >
                <Mic className="h-4 w-4 mr-2" />
                Enable Microphone
              </Button>
            )}

            {voiceCommand && voiceListening && lastHeard && (
              <div className="ml-13 p-2 rounded bg-muted/50 text-xs text-muted-foreground">
                <span className="font-medium">Last heard:</span> "{lastHeard}"
              </div>
            )}
          </CardContent>
        </Card>

        {/* Alert Settings */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Settings className="h-4 w-4 text-primary" />
              Alert Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                  {silentMode ? (
                    <EyeOff className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <Volume2 className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-sm">Silent Mode</p>
                  <p className="text-xs text-muted-foreground">No sound or visual feedback</p>
                </div>
              </div>
              <Switch checked={silentMode} onCheckedChange={setSilentMode} />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium text-sm">Live Location Tracking</p>
                  <p className="text-xs text-muted-foreground">Share live location for 30 min</p>
                </div>
              </div>
              <Switch checked={liveTracking} onCheckedChange={setLiveTracking} />
            </div>
          </CardContent>
        </Card>

        {/* Emergency Message Preview */}
        <Card className="border-destructive/30 bg-destructive/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-destructive" />
              Emergency Message Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-3 rounded-lg bg-background border text-sm">
              <p className="font-medium text-destructive mb-2">🚨 EMERGENCY SOS</p>
              <p className="text-muted-foreground">
                I need help! This is an emergency alert from [Your Name]. 
                My current location: [GPS Link]
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Sent via Community Compass Safety Feature
              </p>
            </div>
            <Button variant="outline" size="sm" className="mt-3 w-full">
              <MessageSquare className="h-4 w-4 mr-2" />
              Customize Message
            </Button>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <div className="grid grid-cols-3 gap-3">
          <Link to="/check-in">
            <Card className="border-primary/30 hover:border-primary/50 transition-colors cursor-pointer h-full">
              <CardContent className="py-4 flex flex-col items-center text-center gap-2">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Timer className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">Check-in</p>
                  <p className="text-xs text-muted-foreground">Periodic alerts</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/fake-call">
            <Card className="border-green-500/30 hover:border-green-500/50 transition-colors cursor-pointer h-full">
              <CardContent className="py-4 flex flex-col items-center text-center gap-2">
                <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                  <Phone className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="font-medium text-sm">Fake Call</p>
                  <p className="text-xs text-muted-foreground">Escape situations</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/safe-arrival">
            <Card className="border-blue-500/30 hover:border-blue-500/50 transition-colors cursor-pointer h-full">
              <CardContent className="py-4 flex flex-col items-center text-center gap-2">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="font-medium text-sm">Safe Arrival</p>
                  <p className="text-xs text-muted-foreground">Trip tracking</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Safety Tips */}
        <Card className="bg-muted/30">
          <CardContent className="pt-4">
            <div className="flex gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium mb-1">Safety Tips</p>
                <ul className="text-muted-foreground space-y-1 text-xs">
                  <li>• Test your SOS regularly to ensure it works</li>
                  <li>• Keep at least 2 emergency contacts updated</li>
                  <li>• Enable location services for accurate tracking</li>
                  <li>• Inform your contacts about this safety feature</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default SOSPage;
