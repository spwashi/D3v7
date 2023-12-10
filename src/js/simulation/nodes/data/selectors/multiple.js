export function selectOppositeNodes(fn) {
  return getAllNodes().filter((node, i) => !fn(node, i));
}

export function selectNodesInRect(rect) {
  return getAllNodes().filter(node => {
    return node.x > rect.x && node.x < rect.x + rect.width &&
           node.y > rect.y && node.y < rect.y + rect.height
  });
}

export function getAllNodes() {
  return window.spwashi.nodes;
}

export function getSelectedNodes() {
  return window.spwashi.selectedNodes;
}