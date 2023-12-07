import {select} from "d3";

function initSvg() {
  const svg    = select("svg#simulation");
  const g      = svg.select('g.simulation-content');
  const rectsG = g.select('g.rects');
  const edges  = g.select('g.edges');
  const nodes  = g.select('g.nodes');

  return {
    svg,
    wrapper:      g,
    edgesWrapper: edges,
    nodesWrapper: nodes
  };
}

export function initSvgProperties(svg) {
  svg
    .attr('width', window.spwashi.parameters.width)
    .attr('height', window.spwashi.parameters.height)
    .attr("preserveAspectRatio", "xMinYMin meet");
}

export const simulationElements = initSvg();
