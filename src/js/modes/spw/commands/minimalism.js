import {toggleInterfaceDepthOptions} from "../../../init/hotkeys";

export function runMinimalismCommand() {
  {
    window.spwashi.minimalism = true;
    toggleInterfaceDepthOptions();
    document.body.dataset.displaymode = 'nodes';
    return;
  }
}