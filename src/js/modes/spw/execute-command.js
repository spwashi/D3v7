import {commands, runDefaultCommand} from "./commands";

export function executeCommand(command, sideEffects) {
  if (commands[command]) {
    return commands[command](sideEffects);
  } else {
    return runDefaultCommand(command, sideEffects);
  }
}