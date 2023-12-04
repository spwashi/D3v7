export function runUnfreezeCommand() {
  window.spwashi.nodes.forEach(node => {
    node.fx = node.fy = undefined;
  });
}