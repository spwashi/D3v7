import {removeNodes}            from "../../../simulation/nodes/data/set";
import {reinitializeSimulation} from "../../../simulation/simulation";

export function lessNodes() {
  const amountToRemove = window.spwashi.parameters.nodes.count;
  removeNodes(amountToRemove);
  reinitializeSimulation();
}