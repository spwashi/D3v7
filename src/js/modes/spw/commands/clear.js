import {removeAllNodes}         from "../../../simulation/nodes/data/set";
import {reinitializeSimulation} from "../../../simulation/simulation";
import {initFocalSquare}        from "../../../ui/focal-point";
import {removeAllLinks}         from "../../../simulation/edges/data/set";

export function runClearCommand() {
  removeAllNodes();
  removeAllLinks();
  reinitializeSimulation();
  initFocalSquare().focus();
}