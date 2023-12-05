import {select} from "d3";

function initSvg() {
  const svg      = select("svg#simulation");
  const g        = svg.append('g').attr('id', 'simulation-content');
  const rectsG   = g.append('g').classed('rects', true);
  const linksG   = g.append('g').classed('links', true);
  const circlesG = g.append('g').classed('nodes', true);

  return {
    svg,
    wrapper: g,
    linksG,
    circlesG
  };
}

export function initSvgProperties(svg) {
  svg
    .attr('width', window.spwashi.parameters.width)
    .attr('height', window.spwashi.parameters.height)
    .attr("preserveAspectRatio", "xMinYMin meet");
}

export const simulationElements = initSvg();
