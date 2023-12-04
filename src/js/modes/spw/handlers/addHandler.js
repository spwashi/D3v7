import {NODE_MANAGER} from "../../../simulation/nodes/nodes";
import {processNode}  from "../../../simulation/nodes/processNode";

export const addHandler = {
  regex:   /^add=(-?\d+)/,
  handler: (sideEffects, value) => {
    const quantity = parseInt(value);
    const nodes    = [...Array(quantity)].map((n, i) => ({
      name: i + '',
      id:   Date.now() + Math.random(),
    }));
    window.spwashi.nodes.push(...nodes.map(NODE_MANAGER.normalize).map(processNode));
    sideEffects.nodesAdded.push(...nodes);
    sideEffects.physicsChange = true;
  }
};