import {logMainEvent} from "./nodes/circle";
import {NODE_MANAGER} from "./nodes/nodes";
import {EDGE_MANAGER} from "./edges/links";
import {RECT_MANAGER} from "./rects/rects";


const simulationSVG   = d3.select("svg#simulation");
const g               = simulationSVG.append('g').attr('id', 'simulation-content');
const rectsG          = g.append('g').classed('rects', true);
const linksG          = g.append('g').classed('links', true);
const circlesG        = g.append('g').classed('nodes', true);
const nodeG_offset    = {x: 0, y: 0};
const nodeG_transform = {x: 0, y: 0};

function initializeForces(simulation, links, nodes) {
  simulation.alpha(window.spwashi.parameters.forces.alpha);
  simulation.alphaTarget(window.spwashi.parameters.forces.alphaTarget);
  simulation.alphaDecay(window.spwashi.parameters.forces.alphaDecay);
  simulation.velocityDecay(window.spwashi.parameters.forces.velocityDecay);
  simulation.force(
    'link',
    d3.forceLink().links(links).id(d => d.id).strength(l => l.strength || 1)
  );
  simulation.force(
    'collide',
    d3.forceCollide(d => d.r)
  );
  simulation.force('charge', null)
  simulation.force(
    'charge',
    d3.forceManyBody().strength(d => d.charge || window.spwashi.parameters.forces.charge)
  );
  simulation.force(
    'center',
    d3.forceCenter(...[
      window.spwashi.parameters.forces.centerPos.x,
      window.spwashi.parameters.forces.centerPos.y,
    ]).strength(window.spwashi.parameters.forces.center)
  );
  simulation.force('boundingBox', null);
  window.spwashi.parameters.forces.boundingBox && simulation.force('boundingBox', (alpha) => {
    for (let i = 0, n = nodes.length, k = alpha * 0.1; i < n; ++i) {
      const node = nodes[i];
      if (node.x > window.spwashi.parameters.width) {
        node.x = window.spwashi.parameters.width;
        node.vx *= .9;
      } else if (node.x < 0) {
        node.x = 0;
        node.vx *= .9;
      }
      if (node.y > window.spwashi.parameters.height) {
        node.y = window.spwashi.parameters.height;
        node.vy *= .9;
      } else if (node.y < 0) {
        node.y = 0;
        node.vy *= .9;
      }
    }
  });
}

export function reinitializeSimulation() {
  window.spwashi.counter = 0;
  simulationSVG
    .attr('width', window.spwashi.parameters.width)
    .attr('height', window.spwashi.parameters.height)
    .attr("preserveAspectRatio", "xMinYMin meet");

  if (window.spwashi.parameters.canzoom) {
    simulationSVG
      .call(d3.zoom()
              .on("zoom", (e, d) => {
                const factor = (e.transform.k - 1) * 10;

                window.spwashi.zoomTransform = {k: factor};

                if (e.sourceEvent.shiftKey) {
                  window.spwashi.parameters.forces._charge = window.spwashi.parameters.forces._charge || window.spwashi.parameters.forces.charge;
                  window.spwashi.parameters.forces.charge  = window.spwashi.parameters.forces._charge * factor;
                  reinitializeSimulation();
                } else {
                  window.spwashi.nodes.forEach(node => {
                    node.private._r = node.private._r || node.r
                    node.r          = node.private._r * e.transform.k;
                  })
                }
              }));
  } else if (window.spwashi.parameters.canpan) {
    simulationSVG
      .call(d3
              .drag()
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
        const nodes      = window.spwashi.nodes.filter(node => {
          return node.x > rect.x && node.x < rect.x + rect.width &&
                 node.y > rect.y && node.y < rect.y + rect.height
        });
        const xRange     = d3.extent(nodes, d => d.x);
        const xIncrement = (xRange[1] - xRange[0]) / nodes.length;
        const yRange     = d3.extent(nodes, d => d.y);
        const yIncrement = (yRange[1] - yRange[0]) / nodes.length;
        logMainEvent(xRange + ' ' + yRange)
        nodes.forEach((node, i) => {
          node.fx     = xRange[0] + (xIncrement * i);
          node.fy     = yRange[0] + (yIncrement * i);
          node.charge = -1000;
        });
        window.spwashi.rects.splice(window.spwashi.rects.indexOf(rect), 1);
        reinitializeSimulation();
        rect = null;
        logMainEvent('mouseup:' + e.y + ' ' + e.x);
      });
  }
  const nodes = NODE_MANAGER.initNodes(window.spwashi.nodes);
  const links = EDGE_MANAGER.initLinks(window.spwashi.links, nodes);
  const rects = RECT_MANAGER.initRects(window.spwashi.rects)

  const simulation = window.spwashi.simulation;
  simulation.nodes(nodes);
  initializeForces(simulation, links, nodes);
  window.spwashi.tick           = () => {
    simulation.tick(1);
    window.spwashi.internalTicker();
  };
  window.spwashi.internalTicker = () => {
    window.spwashi.counter += 1;
    rects.forEach(d => d.calc(d));
    EDGE_MANAGER.updateLinks(g, links);
    NODE_MANAGER.updateNodes(g, nodes);
    RECT_MANAGER.updateRects(g, rects);
  };
  simulation.on('tick', window.spwashi.internalTicker);
  document.querySelector('#output').innerHTML = JSON.stringify(window.spwashi.parameters, null, 2);
}
