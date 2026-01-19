import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { 
  ArrowLeft, 
  Phone, 
  PhoneOff, 
  User, 
  Plus, 
  Settings, 
  Clock,
  Volume2,
  Vibrate,
  Edit2,
  Trash2,
  Play
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface FakeCaller {
  id: string;
  name: string;
  phone: string;
  avatar?: string;
  relationship: string;
}

interface CallSettings {
  delay: number;
  vibrate: boolean;
  sound: boolean;
  autoAnswer: boolean;
  autoAnswerDelay: number;
}

const defaultCallers: FakeCaller[] = [
  { id: "1", name: "Mom", phone: "+1 (555) 123-4567", relationship: "Family" },
  { id: "2", name: "Boss", phone: "+1 (555) 987-6543", relationship: "Work" },
  { id: "3", name: "Best Friend", phone: "+1 (555) 456-7890", relationship: "Friend" },
];

const FakeCall = () => {
  const [callers, setCallers] = useState<FakeCaller[]>(defaultCallers);
  const [selectedCaller, setSelectedCaller] = useState<FakeCaller | null>(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isRinging, setIsRinging] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isAddCallerOpen, setIsAddCallerOpen] = useState(false);
  const [settings, setSettings] = useState<CallSettings>({
    delay: 5,
    vibrate: true,
    sound: true,
    autoAnswer: false,
    autoAnswerDelay: 10,
  });
  const [newCaller, setNewCaller] = useState<Partial<FakeCaller>>({
    name: "",
    phone: "",
    relationship: "Friend",
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const delayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const callTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (delayTimerRef.current) clearTimeout(delayTimerRef.current);
      if (callTimerRef.current) clearInterval(callTimerRef.current);
    };
  }, []);

  const triggerCall = (caller: FakeCaller) => {
    setSelectedCaller(caller);
    toast.info(`Call from ${caller.name} in ${settings.delay} seconds...`);
    
    delayTimerRef.current = setTimeout(() => {
      setIsRinging(true);
      
      if (settings.vibrate && navigator.vibrate) {
        // Vibrate pattern: vibrate 500ms, pause 200ms, repeat
        const vibratePattern = () => {
          navigator.vibrate([500, 200, 500, 200, 500]);
        };
        vibratePattern();
        timerRef.current = setInterval(vibratePattern, 1500);
      }

      if (settings.autoAnswer) {
        setTimeout(() => {
          answerCall();
        }, settings.autoAnswerDelay * 1000);
      }
    }, settings.delay * 1000);
  };

  const answerCall = () => {
    setIsRinging(false);
    setIsCallActive(true);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      navigator.vibrate?.(0);
    }
    
    callTimerRef.current = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
  };

  const endCall = () => {
    setIsRinging(false);
    setIsCallActive(false);
    setCallDuration(0);
    setSelectedCaller(null);
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
      navigator.vibrate?.(0);
    }
    if (callTimerRef.current) clearInterval(callTimerRef.current);
    if (delayTimerRef.current) clearTimeout(delayTimerRef.current);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const addCaller = () => {
    if (!newCaller.name || !newCaller.phone) {
      toast.error("Please fill in all fields");
      return;
    }
    
    const caller: FakeCaller = {
      id: Date.now().toString(),
      name: newCaller.name,
      phone: newCaller.phone,
      relationship: newCaller.relationship || "Friend",
    };
    
    setCallers([...callers, caller]);
    setNewCaller({ name: "", phone: "", relationship: "Friend" });
    setIsAddCallerOpen(false);
    toast.success("Caller added successfully");
  };

  const deleteCaller = (id: string) => {
    setCallers(callers.filter(c => c.id !== id));
    toast.success("Caller removed");
  };

  // Incoming call screen
  if (isRinging && selectedCaller) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex flex-col items-center justify-between py-12 px-6">
        <div className="text-center">
          <p className="text-gray-400 text-lg mb-2">Incoming call</p>
          <Avatar className="w-32 h-32 mx-auto mb-4 ring-4 ring-green-500/50">
            <AvatarImage src={selectedCaller.avatar} />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-4xl text-white">
              {selectedCaller.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <h1 className="text-3xl font-bold text-white mb-1">{selectedCaller.name}</h1>
          <p className="text-gray-400">{selectedCaller.phone}</p>
        </div>

        <div className="w-full max-w-xs space-y-4">
          <div className="flex justify-center gap-16">
            <button
              onClick={endCall}
              className="w-20 h-20 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center shadow-lg shadow-red-500/30 transition-all hover:scale-105"
            >
              <PhoneOff className="w-8 h-8 text-white" />
            </button>
            <button
              onClick={answerCall}
              className="w-20 h-20 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center shadow-lg shadow-green-500/30 transition-all hover:scale-105 animate-pulse"
            >
              <Phone className="w-8 h-8 text-white" />
            </button>
          </div>
          <p className="text-center text-gray-500 text-sm">Swipe up to answer with message</p>
        </div>
      </div>
    );
  }

  // Active call screen
  if (isCallActive && selectedCaller) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex flex-col items-center justify-between py-12 px-6">
        <div className="text-center">
          <Avatar className="w-28 h-28 mx-auto mb-4">
            <AvatarImage src={selectedCaller.avatar} />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-3xl text-white">
              {selectedCaller.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <h1 className="text-2xl font-bold text-white mb-1">{selectedCaller.name}</h1>
          <p className="text-green-400 font-mono text-lg">{formatDuration(callDuration)}</p>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-8">
          {[
            { icon: Volume2, label: "Speaker" },
            { icon: Vibrate, label: "Mute" },
            { icon: User, label: "Contacts" },
          ].map((item, i) => (
            <button key={i} className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center">
                <item.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-gray-400 text-sm">{item.label}</span>
            </button>
          ))}
        </div>

        <button
          onClick={endCall}
          className="w-20 h-20 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center shadow-lg shadow-red-500/30 transition-all hover:scale-105"
        >
          <PhoneOff className="w-8 h-8 text-white" />
        </button>
      </div>
    );
  }

  // Main setup screen
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border px-4 py-3 flex items-center gap-3">
        <Link to="/sos" className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-xl font-bold text-foreground">Fake Call</h1>
      </header>

      <main className="p-4 space-y-6 max-w-lg mx-auto">
        {/* Quick Trigger */}
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Phone className="w-5 h-5 text-primary" />
              Quick Trigger
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Select a caller to trigger an incoming call after {settings.delay} seconds
            </p>
            <div className="grid gap-2">
              {callers.map((caller) => (
                <div
                  key={caller.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-card border border-border hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={caller.avatar} />
                      <AvatarFallback className="bg-primary/20 text-primary">
                        {caller.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-foreground">{caller.name}</p>
                      <p className="text-xs text-muted-foreground">{caller.relationship}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteCaller(caller.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => triggerCall(caller)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Play className="w-4 h-4 mr-1" />
                      Call
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <Dialog open={isAddCallerOpen} onOpenChange={setIsAddCallerOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full mt-3">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Caller
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Caller</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Name</Label>
                    <Input
                      value={newCaller.name || ""}
                      onChange={(e) => setNewCaller({ ...newCaller, name: e.target.value })}
                      placeholder="e.g., Mom, Boss, Doctor"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone Number</Label>
                    <Input
                      value={newCaller.phone || ""}
                      onChange={(e) => setNewCaller({ ...newCaller, phone: e.target.value })}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Relationship</Label>
                    <Select
                      value={newCaller.relationship}
                      onValueChange={(v) => setNewCaller({ ...newCaller, relationship: v })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Family">Family</SelectItem>
                        <SelectItem value="Friend">Friend</SelectItem>
                        <SelectItem value="Work">Work</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={addCaller} className="w-full">
                    Add Caller
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        {/* Call Settings */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Call Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Call Delay
              </Label>
              <Select
                value={settings.delay.toString()}
                onValueChange={(v) => setSettings({ ...settings, delay: parseInt(v) })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Immediate</SelectItem>
                  <SelectItem value="5">5 seconds</SelectItem>
                  <SelectItem value="10">10 seconds</SelectItem>
                  <SelectItem value="30">30 seconds</SelectItem>
                  <SelectItem value="60">1 minute</SelectItem>
                  <SelectItem value="300">5 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <Vibrate className="w-4 h-4 text-muted-foreground" />
                <Label>Vibration</Label>
              </div>
              <Switch
                checked={settings.vibrate}
                onCheckedChange={(v) => setSettings({ ...settings, vibrate: v })}
              />
            </div>

            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-muted-foreground" />
                <Label>Sound</Label>
              </div>
              <Switch
                checked={settings.sound}
                onCheckedChange={(v) => setSettings({ ...settings, sound: v })}
              />
            </div>

            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <Label>Auto-answer</Label>
              </div>
              <Switch
                checked={settings.autoAnswer}
                onCheckedChange={(v) => setSettings({ ...settings, autoAnswer: v })}
              />
            </div>

            {settings.autoAnswer && (
              <div className="space-y-2 pl-6">
                <Label className="text-sm text-muted-foreground">Auto-answer after</Label>
                <Select
                  value={settings.autoAnswerDelay.toString()}
                  onValueChange={(v) => setSettings({ ...settings, autoAnswerDelay: parseInt(v) })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 seconds</SelectItem>
                    <SelectItem value="10">10 seconds</SelectItem>
                    <SelectItem value="15">15 seconds</SelectItem>
                    <SelectItem value="20">20 seconds</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tips */}
        <Card className="bg-muted/50">
          <CardContent className="pt-4">
            <h3 className="font-medium mb-2">💡 Tips for using Fake Call</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Set a short delay and trigger before entering uncomfortable situations</li>
              <li>• Use a believable caller name like "Mom" or "Boss"</li>
              <li>• Enable auto-answer for hands-free operation</li>
              <li>• Practice using it so you're prepared in real situations</li>
            </ul>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default FakeCall;
