import {reinitializeSimulation} from "../simulation";

export const generateNodes = (n) => {
  const count = n || window.spwashi.parameters.nodes.count;
  const nodes = [...Array(count)].map(n => ({name: 'boon'}));
  window.spwashi.nodes.push(...nodes);
  reinitializeSimulation();
}