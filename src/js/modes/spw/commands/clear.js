import {removeAllNodes}         from "../../../simulation/nodes/data/set";
import {initFocalSquare}        from "../../../ui/focal-point";
import {removeAllLinks} from "../../../simulation/edges/data/set";
import {reinit}         from "../../../simulation/reinit";

export function runClearCommand() {
  removeAllNodes();
  removeAllLinks();
  reinit();
  initFocalSquare().focus();
}