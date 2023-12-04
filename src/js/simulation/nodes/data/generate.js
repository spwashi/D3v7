import {reinitializeSimulation} from "../../simulation";
import {pushNodes}              from "./operate";

export const generateNodes = (n) => {
  const count = n || window.spwashi.parameters.nodes.count;
  const nodes = [...Array(count)].map(n => ({
    name:     'boon',
    identity: Date.now() + Math.random(),
  }));
  pushNodes(...nodes);
  reinitializeSimulation();
  return nodes;
}