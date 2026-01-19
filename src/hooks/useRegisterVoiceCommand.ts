import { useEffect, useRef } from "react";
import { useVoiceAssistantContext, VoiceCommand } from "@/context/VoiceAssistantContext";

export function useRegisterVoiceCommand(command: VoiceCommand | VoiceCommand[]) {
  const { registerCommand } = useVoiceAssistantContext();

  // Store the latest commands in a ref to avoid stale closures in callbacks
  const commandsRef = useRef(command);

  // Update ref whenever command props change (including new closures for actions)
  useEffect(() => {
    commandsRef.current = command;
  }, [command]);

  useEffect(() => {
    // We register a wrapper command that always delegates to the latest ref
    // This allows us to register once but always execute the freshest callback
    const currentCommands = Array.isArray(commandsRef.current) ? commandsRef.current : [commandsRef.current];

    // Map to command objects that delegate actions to the ref
    const dynamicCommands = currentCommands.map((cmd, index) => ({
      ...cmd,
      action: () => {
        // Resolve the latest version of this specific command
        const latestCmds = Array.isArray(commandsRef.current) ? commandsRef.current : [commandsRef.current];
        const latestCmd = latestCmds[index]; // Assume index stability for simple use cases
        if (latestCmd && latestCmd.action) {
          latestCmd.action();
        }
      }
    }));

    const unregisterFns = dynamicCommands.map(cmd => registerCommand(cmd));

    return () => {
      unregisterFns.forEach(unregister => unregister());
    };
    // We only want to re-register if the *structure* (IDs/keywords) changes, not the closures
    // Using JSON.stringify on non-function parts would be ideal, but for now
    // we depend on the command ID or keywords.
    // If we re-register on every render, we might flicker or loose audio context focus.
    // The previous JSON.stringify dependency was preventing stale closures from updating *because* it ignored functions.
    // Now we use a ref pattern so the registration effect doesn't NEED to re-run just to update the closure.
    // We use a specific dependency that represents the identity of the commands.
  }, [registerCommand, JSON.stringify(Array.isArray(command) ? command.map(c => ({ id: c.id, keywords: c.keywords })) : { id: command.id, keywords: command.keywords })]);
}
