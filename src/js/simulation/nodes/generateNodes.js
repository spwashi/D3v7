import {reinitializeSimulation} from "../simulation";

export const generateNodes = (n) => {
  const count = n || window.spwashi.parameters.nodes.count;
  const nodes = [...Array(count)].map(n => ({}));
  window.spwashi.nodes.push(...nodes);
  reinitializeSimulation();
}