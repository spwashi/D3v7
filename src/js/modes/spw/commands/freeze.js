export function runFreezeCommand() {
  window.spwashi.nodes.forEach(node => {
    node.fx = node.x;
    node.fy = node.y;
  });
}