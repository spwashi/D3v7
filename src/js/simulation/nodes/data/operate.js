export function pushNode(...nodes) {
  window.spwashi.nodes.push(...nodes);
}

export function mapNodes(fn) {
  return window.spwashi.nodes.map(fn);
}

export function forEachNode(fn) {
  window.spwashi.nodes.forEach(fn);
}

