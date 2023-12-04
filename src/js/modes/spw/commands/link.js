export function runLinkCommand(sideEffects) {
  const nodes = window.spwashi.nodes;
  nodes.forEach((node, i) => {
    const source = nodes[i];
    const target = nodes[(i + 1) % nodes.length];
    window.spwashi.links.push({source, target, strength: .1});
  });
  sideEffects.physicsChange = true;
}