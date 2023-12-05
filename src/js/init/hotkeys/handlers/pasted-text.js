import {convertRawInput}        from "../../../modes/direct/mode-direct";
import {NODE_MANAGER}           from "../../../simulation/nodes/nodes";
import {pushNode}               from "../../../simulation/nodes/data/operate";
import {EDGE_MANAGER}           from "../../../simulation/edges/edges";
import {pushLink}               from "../../../simulation/edges/data/pushLink";
import {reinitializeSimulation} from "../../../simulation/simulation";

export function processPastedText(clipboardText) {
  const data = convertRawInput(clipboardText);
  if (data.nodes.length === 0) {
    return false;
  }
  const nodes = data.nodes.filter(NODE_MANAGER.filterNode);
  nodes.forEach(NODE_MANAGER.processNode);
  pushNode(...nodes);
  const edges = EDGE_MANAGER.initLinks(data.links, nodes);
  pushLink(window.spwashi.links, ...edges);
  reinitializeSimulation();
}