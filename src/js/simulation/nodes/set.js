export function setNodeData(activeNodes) {
  window.spwashi.nodes = activeNodes;
}

export function removeAllNodes() {
  window.spwashi.nodes = [];
}

export function removeClusterNodes() {
  window.spwashi.nodes = window.spwashi.nodes.filter(node => node.kind !== '__cluster');
}

export function removeNodes(amountToRemove) {
  window.spwashi.nodes.length = Math.max(0, window.spwashi.nodes.length - amountToRemove);
}