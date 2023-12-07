import {pushNode} from "./operate";
import {processNode} from "./process";

export const generateNodes = (n) => {
  const count = n || window.spwashi.parameters.nodes.count;
  const nodes = [...Array(count)].map(n => ({
    name:     'boon',
    identity: Date.now() + Math.random(),
  }));
  pushNode(...nodes.map(processNode));
  window.spwashi.reinit();
  return nodes;
}