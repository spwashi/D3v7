export function runScatterCommand(sideEffects) {
  window.spwashi.nodes.forEach(node => {
    node.x = Math.random() * 1000;
    node.y = Math.random() * 1000;
  });
  sideEffects.physicsChange = true;
}