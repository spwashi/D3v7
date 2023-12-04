export const radiusHandler = {
  regex:   /^r=(\d+)/,
  handler: (sideEffects, value) => {
    window.spwashi.nodes.forEach(node => node.r = parseInt(value));
    sideEffects.physicsChange = true;
  }
};