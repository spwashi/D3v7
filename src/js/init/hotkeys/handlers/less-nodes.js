import {removeNodes} from "../../../simulation/nodes/data/set";

export function lessNodes() {
  const amountToRemove = window.spwashi.parameters.nodes.count;
  removeNodes(amountToRemove);
 window.spwashi.reinit();
}