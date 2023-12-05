export function setNodeData(activeNodes) {
  window.spwashi.nodes = activeNodes;
}

export function removeAllNodes() {
  window.spwashi.nodes = [];
}

export function removeClusterNodes() {
  window.spwashi.nodes = window.spwashi.nodes.filter(node => node.kind !== '__cluster');
  window.spwashi.links = window.spwashi.links.filter(link => link.source.kind !== '__cluster' && link.target.kind !== '__cluster');
}

export function removeNodes(amountToRemove) {
  window.spwashi.nodes.length = Math.max(0, window.spwashi.nodes.length - amountToRemove);
}