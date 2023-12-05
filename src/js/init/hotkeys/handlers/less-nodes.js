import {removeNodes} from "../../../simulation/nodes/data/set";

import {reinit}      from "../../../simulation/reinit";

export function lessNodes() {
  const amountToRemove = window.spwashi.parameters.nodes.count;
  removeNodes(amountToRemove);
  reinit();
}