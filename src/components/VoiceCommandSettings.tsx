import { useState, useEffect } from "react";
import { Settings, Save, RotateCcw, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface FeatureCommands {
  [featurePath: string]: string[];
}

interface VoiceCommandSettingsProps {
  features: Array<{
    name: { en: string; bn: string };
    path: string;
    voiceCommands: string[];
  }>;
  onCommandsUpdate: (commands: FeatureCommands) => void;
  language: "en" | "bn" | null;
}

const STORAGE_KEY = "voice-command-customizations";

export function VoiceCommandSettings({ 
  features, 
  onCommandsUpdate,
  language 
}: VoiceCommandSettingsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [customCommands, setCustomCommands] = useState<FeatureCommands>({});
  const [newCommand, setNewCommand] = useState<{ [path: string]: string }>({});

  // Load saved customizations from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setCustomCommands(parsed);
        onCommandsUpdate(parsed);
      } catch (e) {
        console.error("Failed to load voice command settings:", e);
      }
    }
  }, [onCommandsUpdate]);

  // Get combined commands for a feature (default + custom)
  const getCommands = (path: string, defaultCommands: string[]) => {
    const custom = customCommands[path] || [];
    return [...defaultCommands, ...custom];
  };

  // Add a new custom command
  const handleAddCommand = (path: string) => {
    const command = newCommand[path]?.trim();
    if (!command) return;

    const updated = {
      ...customCommands,
      [path]: [...(customCommands[path] || []), command.toLowerCase()]
    };

    setCustomCommands(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    onCommandsUpdate(updated);
    setNewCommand({ ...newCommand, [path]: "" });
    
    toast.success(
      language === "bn" 
        ? "কমান্ড যোগ করা হয়েছে" 
        : "Command added"
    );
  };

  // Remove a custom command
  const handleRemoveCommand = (path: string, command: string) => {
    const updated = {
      ...customCommands,
      [path]: (customCommands[path] || []).filter(c => c !== command)
    };

    if (updated[path].length === 0) {
      delete updated[path];
    }

    setCustomCommands(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    onCommandsUpdate(updated);
    
    toast.success(
      language === "bn" 
        ? "কমান্ড সরানো হয়েছে" 
        : "Command removed"
    );
  };

  // Reset all custom commands
  const handleResetAll = () => {
    setCustomCommands({});
    localStorage.removeItem(STORAGE_KEY);
    onCommandsUpdate({});
    
    toast.success(
      language === "bn" 
        ? "সব কাস্টম কমান্ড রিসেট হয়েছে" 
        : "All custom commands reset"
    );
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Settings className="w-4 h-4" />
          {language === "bn" ? "কমান্ড সেটিংস" : "Command Settings"}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary" />
            {language === "bn" ? "ভয়েস কমান্ড সেটিংস" : "Voice Command Settings"}
          </SheetTitle>
          <SheetDescription>
            {language === "bn" 
              ? "প্রতিটি ফিচারের জন্য আপনার নিজের ট্রিগার শব্দ যোগ করুন" 
              : "Add your own trigger phrases for each feature"}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Reset All Button */}
          <div className="flex justify-end">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleResetAll}
              className="text-destructive hover:text-destructive"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              {language === "bn" ? "সব রিসেট" : "Reset All"}
            </Button>
          </div>

          {/* Features List */}
          <div className="space-y-6">
            {features.map((feature) => (
              <div 
                key={feature.path} 
                className="p-4 rounded-xl bg-secondary/50 border border-border space-y-3"
              >
                <div>
                  <h4 className="font-medium text-foreground">
                    {language === "bn" ? feature.name.bn : feature.name.en}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {feature.path}
                  </p>
                </div>

                {/* Current Commands */}
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">
                    {language === "bn" ? "বর্তমান কমান্ড:" : "Current Commands:"}
                  </Label>
                  <div className="flex flex-wrap gap-1.5">
                    {/* Default commands (non-removable) */}
                    {feature.voiceCommands.slice(0, 3).map((cmd) => (
                      <Badge 
                        key={cmd} 
                        variant="secondary" 
                        className="text-xs"
                      >
                        {cmd}
                      </Badge>
                    ))}
                    {feature.voiceCommands.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{feature.voiceCommands.length - 3} more
                      </Badge>
                    )}
                    
                    {/* Custom commands (removable) */}
                    {(customCommands[feature.path] || []).map((cmd) => (
                      <Badge 
                        key={cmd} 
                        variant="default" 
                        className="text-xs gap-1 pr-1 bg-primary/80"
                      >
                        {cmd}
                        <button
                          onClick={() => handleRemoveCommand(feature.path, cmd)}
                          className="ml-1 hover:bg-primary-foreground/20 rounded-full p-0.5"
                          aria-label={`Remove ${cmd}`}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Add New Command */}
                <div className="flex gap-2">
                  <Input
                    placeholder={language === "bn" ? "নতুন কমান্ড যোগ করুন..." : "Add new command..."}
                    value={newCommand[feature.path] || ""}
                    onChange={(e) => setNewCommand({ 
                      ...newCommand, 
                      [feature.path]: e.target.value 
                    })}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleAddCommand(feature.path);
                      }
                    }}
                    className="text-sm h-9"
                  />
                  <Button
                    size="sm"
                    onClick={() => handleAddCommand(feature.path)}
                    disabled={!newCommand[feature.path]?.trim()}
                    className="h-9 px-3"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Tips */}
          <div className="p-3 bg-accent/50 rounded-lg text-xs text-muted-foreground space-y-1">
            <p className="font-medium text-foreground">
              {language === "bn" ? "টিপস:" : "Tips:"}
            </p>
            <ul className="list-disc list-inside space-y-0.5">
              <li>
                {language === "bn" 
                  ? "আপনি বাংলা বা ইংরেজিতে কমান্ড যোগ করতে পারেন" 
                  : "Add commands in English or Bangla"}
              </li>
              <li>
                {language === "bn" 
                  ? "সংক্ষিপ্ত, স্পষ্ট শব্দ সবচেয়ে ভালো কাজ করে" 
                  : "Short, clear phrases work best"}
              </li>
              <li>
                {language === "bn" 
                  ? "ডিফল্ট কমান্ডগুলো সবসময় কাজ করবে" 
                  : "Default commands always remain active"}
              </li>
            </ul>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
