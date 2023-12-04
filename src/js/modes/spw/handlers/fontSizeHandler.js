export const fontSizeHandler = {
  regex:   /^fontSize=(\d+)/,
  handler: (sideEffects, value) => {
    const choice = parseInt(value);
    const nodes  = window.spwashi.nodes;
    nodes.forEach((node, i) => {
      node.text.fontSize = choice;
    });
    sideEffects.physicsChange = true;
  }
};