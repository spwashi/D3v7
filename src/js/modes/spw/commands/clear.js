import {removeAllNodes}         from "../../../simulation/nodes/set";
import {reinitializeSimulation} from "../../../simulation/simulation";
import {initFocalSquare}        from "../../../ui/focal-point";

export function runClearCommand() {
  removeAllNodes();
  window.spwashi.links = [];
  reinitializeSimulation();
  initFocalSquare().focus();
}