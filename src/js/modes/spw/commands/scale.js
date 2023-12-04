import {scaleOrdinal, scaleSequential, schemeCategory10} from "d3";

export function runScaleCommand(sideEffects) {
  // set node color according to scale
  const nodes = window.spwashi.nodes;
  const scale = [
    scaleOrdinal(schemeCategory10),
    scaleSequential([0, nodes.length], t => `hsl(${t * 360}, 100%, 50%)`),
  ][1];
  nodes.forEach((node, i) => {
    node.color = scale(i);
  });
}