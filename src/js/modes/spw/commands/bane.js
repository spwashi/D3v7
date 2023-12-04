export function runBaneCommand() {
  window.spwashi.nodes.forEach(node => {
    node.stroke = 'red';
  });
}