export const collisionRadiusHandler = {
  regex:   /^cr=(\d+)/,
  handler: (sideEffects, value) => {
    window.spwashi.nodes.forEach(node => node.collisionRadius = parseInt(value) * node.r);
    sideEffects.physicsChange = true;
  }
};