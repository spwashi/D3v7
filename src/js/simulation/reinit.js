import {drag, extent, select, zoom} from "d3";
import {forEachNode}                from "./nodes/data/operate";
import {logMainEvent}               from "./nodes/ui/circle";
import {selectNodesInRect}          from "./nodes/data/selectors/multiple";
import {NODE_MANAGER}               from "./nodes/nodes";
import {EDGE_MANAGER}               from "./edges/edges";
import {RECT_MANAGER}               from "./rects/rects";
import {initializeForces}           from "./forces";

const simulationSVG   = select("svg#simulation");
const g               = simulationSVG.append('g').attr('id', 'simulation-content');
const rectsG          = g.append('g').classed('rects', true);
const linksG          = g.append('g').classed('links', true);
const circlesG        = g.append('g').classed('nodes', true);
const nodeG_offset    = {x: 0, y: 0};
const nodeG_transform = {x: 0, y: 0};

function initSvgEvents() {
  if (window.spwashi.parameters.canzoom) {
    simulationSVG
      .call(zoom()
              .on("zoom", (e, d) => {
                const factor                 = (e.transform.k - 1) * 10;
                window.spwashi.zoomTransform = {k: factor};
                if (e.sourceEvent.shiftKey) {
                  window.spwashi.parameters.forces._charge = window.spwashi.parameters.forces._charge || window.spwashi.parameters.forces.charge;
                  window.spwashi.parameters.forces.charge  = window.spwashi.parameters.forces._charge * factor;
                  reinit();
                } else {
                  forEachNode(node => {
                    node.private._r = node.private._r || node.r
                    node.r          = node.private._r * e.transform.k;
                  })
                }
              })
      )
      .on("dblclick.zoom", null)
  } else if (window.spwashi.parameters.canpan) {
    simulationSVG
      .call(drag()
              .on('start', (e) => {
                simulationSVG.attr("cursor", "grabbing");
                nodeG_offset.x = e.x;
                nodeG_offset.y = e.y;
              })
              .on('drag', (e) => {
                const dx = nodeG_offset.x - e.x;
                const dy = nodeG_offset.y - e.y;

                nodeG_transform.x += dx / 10;
                nodeG_transform.y += dy / 10;

                circlesG.attr("transform", `translate(${nodeG_transform.x}, ${nodeG_transform.y})`);
                linksG.attr("transform", `translate(${nodeG_transform.x}, ${nodeG_transform.y})`);
              })
              .on('end', (e) => {
                simulationSVG.attr("cursor", "grab");
                nodeG_offset.x = e.x;
                nodeG_offset.y = e.y;
              })
      )
  } else {
    let rect = null;
    simulationSVG
      .on('mousedown', (e) => {
        rect = {x: e.offsetX, y: e.offsetY, calc: d => d, width: 1, height: 1};
        window.spwashi.rects.push(rect);
        logMainEvent('mousedown:' + e.y + ' ' + e.x);
      })
      .on('mousemove', (e) => {
        if (!rect) return 0;
        rect.width  = e.offsetX - rect.x;
        rect.height = e.offsetY - rect.y;
      })
      .on('mouseup', (e) => {
        const nodes      = selectNodesInRect(rect);
        const xRange     = extent(nodes, d => d.x);
        const xIncrement = (xRange[1] - xRange[0]) / nodes.length;
        const yRange     = extent(nodes, d => d.y);
        const yIncrement = (yRange[1] - yRange[0]) / nodes.length;
        logMainEvent(xRange + ' ' + yRange)
        nodes.forEach((node, i) => {
          node.fx     = xRange[0] + (xIncrement * i);
          node.fy     = yRange[0] + (yIncrement * i);
          node.charge = -1000;
        });
        window.spwashi.rects.splice(window.spwashi.rects.indexOf(rect), 1);
        reinit();
        rect = null;
        logMainEvent('mouseup:' + e.y + ' ' + e.x);
      });
  }
}


// todo this is large, consider dynamic import
export function reinit() {
  window.spwashi.counter = 0;
  simulationSVG
    .attr('width', window.spwashi.parameters.width)
    .attr('height', window.spwashi.parameters.height)
    .attr("preserveAspectRatio", "xMinYMin meet");

  initSvgEvents();

  const nodes      = NODE_MANAGER.initNodes(window.spwashi.nodes);
  const edges      = EDGE_MANAGER.initLinks(nodes);
  const rects      = RECT_MANAGER.initRects(window.spwashi.rects);
  const simulation = window.spwashi.simulation;

  simulation.nodes(nodes);
  initializeForces();

  window.spwashi.tick           = () => {
    simulation.tick(1);
    window.spwashi.internalTicker();
  };
  window.spwashi.internalTicker = () => {
    window.spwashi.counter += 1;
    rects.forEach(d => d.calc(d));
    EDGE_MANAGER.updateLinks(g, edges);
    NODE_MANAGER.updateNodes(g, nodes);
    RECT_MANAGER.updateRects(g, rects);
  };

  simulation.on('tick', window.spwashi.internalTicker);

  document.querySelector('#output').innerHTML = JSON.stringify(window.spwashi.parameters, null, 2);
}