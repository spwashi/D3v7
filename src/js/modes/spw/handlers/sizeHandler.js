import {scaleSequential} from "d3";

export const sizeHandler = {
  regex:   /^size=(\d+)/,
  handler: (sideEffects, value) => {
    const choice  = parseInt(value);
    const nodes   = window.spwashi.nodes;
    const options = [
      scaleSequential([0, nodes.length], t => t * 30),
      scaleSequential([0, nodes.length], t => t * 60),
      scaleSequential([0, nodes.length], t => t * 90),
      scaleSequential([0, nodes.length], t => t * 120),
    ];
    const scale   = options[choice % options.length];
    nodes.forEach((node, i) => {
      node.r = scale(i);
    });
    sideEffects.physicsChange = true;
  }
};