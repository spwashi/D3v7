import {reinitializeSimulation} from "../simulation";

export const generateNodes = (n) => {
  const count = n || window.spwashi.parameters.nodes.count;
  const nodes = [...Array(count)].map(n => ({
    name:     'boon',
    identity: Date.now() + Math.random(),
  }));
  window.spwashi.nodes.push(...nodes);
  reinitializeSimulation();
  return nodes;
}