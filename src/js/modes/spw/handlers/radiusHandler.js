import {forEachNode} from "../../../simulation/nodes/data/operate";

export const radiusHandler = {
  regex:   /^r=(\d+)/,
  handler: (sideEffects, value) => {
    forEachNode(node => {
      if (node.kind === '__boon') return ;
      return node.r = parseInt(value);
    });
    sideEffects.physicsChange = true;
  }
};