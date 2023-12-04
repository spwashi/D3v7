import {initKeystrokes} from "../../../init/hotkeys/hotkeys";

export const extendMenu = `extended menu`.trim();

export function runMoreMenuOptionsCommand() {
  {
    window.spwashi.keystrokeRevealOrder = 1;
    initKeystrokes();
  }
}