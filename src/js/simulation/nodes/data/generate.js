import {pushNode} from "./operate";
import {reinit}   from "../../reinit";

export const generateNodes = (n) => {
  const count = n || window.spwashi.parameters.nodes.count;
  const nodes = [...Array(count)].map(n => ({
    name:     'boon',
    identity: Date.now() + Math.random(),
  }));
  pushNode(...nodes);
  reinit();
  return nodes;
}