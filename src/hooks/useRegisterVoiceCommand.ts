import { useEffect } from "react";
import { useVoiceAssistantContext, VoiceCommand } from "@/context/VoiceAssistantContext";

export function useRegisterVoiceCommand(command: VoiceCommand | VoiceCommand[]) {
  const { registerCommand } = useVoiceAssistantContext();

  useEffect(() => {
    const commands = Array.isArray(command) ? command : [command];
    const unregisterFns = commands.map(cmd => registerCommand(cmd));

    return () => {
      unregisterFns.forEach(unregister => unregister());
    };
  }, [registerCommand, JSON.stringify(command)]); // Deep compare command object/array
}
