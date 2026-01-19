import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useVoiceAssistantContext, VoiceCommand } from "@/context/VoiceAssistantContext";
import { Mic, Navigation, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function VoiceCommandsList() {
  const { allCommands, language, showCommandsList, setShowCommandsList } = useVoiceAssistantContext();

  const handleClose = () => {
    setShowCommandsList(false);
  };

  // Group commands roughly by type (Navigation vs Action)
  // We can guess based on whether they have a 'path' (Navigation) or 'action' (Action)
  // or just list them all. Grouping is nicer.
  const navigationCommands = allCommands.filter(cmd => !!cmd.path);
  const actionCommands = allCommands.filter(cmd => !!cmd.action && !cmd.path);
  // Some might have both, but usually we prioritize action if it's specific.
  // Let's ensure no duplicates if they have both.
  const otherCommands = allCommands.filter(cmd => !cmd.path && !cmd.action); // Fallback?

  return (
    <Dialog open={showCommandsList} onOpenChange={setShowCommandsList}>
      <DialogContent className="sm:max-w-lg max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mic className="h-5 w-5 text-primary" />
            {language === "en" ? "Voice Commands" : "ভয়েস কমান্ড"}
          </DialogTitle>
          <DialogDescription>
            {language === "en"
              ? "Try saying these commands to navigate or perform actions."
              : "নেভিগেট বা কাজ করতে এই কমান্ডগুলো বলুন।"}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-6 py-4">
            {/* Actions Section */}
            {actionCommands.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2 text-sm text-muted-foreground">
                  <Activity className="h-4 w-4" />
                  {language === "en" ? "Actions" : "অ্যাকশন"}
                </h3>
                <div className="grid gap-2">
                  {actionCommands.map((cmd, i) => (
                    <div key={i} className="p-3 rounded-lg bg-secondary/50 border border-border">
                      <div className="flex flex-wrap gap-2">
                        {cmd.keywords[language].map((keyword, k) => (
                          <Badge key={k} variant="outline" className="text-xs bg-background">
                            "{keyword}"
                          </Badge>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        {cmd.response && cmd.response[language]}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation Section */}
            {navigationCommands.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2 text-sm text-muted-foreground">
                  <Navigation className="h-4 w-4" />
                  {language === "en" ? "Navigation" : "নেভিগেশন"}
                </h3>
                <div className="grid gap-2">
                  {navigationCommands.map((cmd, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-secondary/20 border border-border hover:bg-secondary/40 transition-colors">
                      <div className="flex flex-col gap-1">
                         <span className="font-medium text-sm">
                           {cmd.keywords[language][0]}
                           {cmd.keywords[language].length > 1 && <span className="text-muted-foreground text-xs font-normal"> +{cmd.keywords[language].length - 1} more</span>}
                         </span>
                         <span className="text-xs text-muted-foreground font-mono">{cmd.path}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
