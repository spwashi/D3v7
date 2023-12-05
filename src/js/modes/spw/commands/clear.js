import {removeAllNodes}         from "../../../simulation/nodes/data/set";
import {initFocalSquare}        from "../../../ui/focal-point";
import {removeAllLinks} from "../../../simulation/edges/data/set";

export function runClearCommand() {
  removeAllNodes();
  removeAllLinks();
 window.spwashi.reinit();
  initFocalSquare().focus();
}