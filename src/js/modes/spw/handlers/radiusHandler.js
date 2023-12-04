import {forEachNode} from "../../../simulation/nodes/data/operate";

export const radiusHandler = {
  regex:   /^r=(\d+)/,
  handler: (sideEffects, value) => {
    forEachNode(node => node.r = parseInt(value));
    sideEffects.physicsChange = true;
  }
};