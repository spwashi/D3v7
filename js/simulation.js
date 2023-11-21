window.spwashi            = window.spwashi || {};
window.spwashi.simulation = d3.forceSimulation();
window.spwashi.counter    = 0;
window.spwashi.nodes      = window.spwashi.nodes || [];
window.spwashi.links      = window.spwashi.links || [];
window.spwashi.rects      = window.spwashi.rects || [
  {
    title: 'Counter',
    x:     0,
    width: 0,
    calc:  d => d.width = window.spwashi.counter * 1
  },
  {
    title: 'Alpha',
    x:     0,
    width: 0,
    calc:  d => d.width = window.spwashi.simulation.alpha() * (window.spwashi.parameters.width || 0)
  },
  {
    title: 'Alpha Decay',
    x:     0,
    width: 0,
    calc:  d => d.width = window.spwashi.simulation.alphaDecay() * (window.spwashi.parameters.width || 0)
  },
  {
    title: 'Charge',
    x:     0,
    width: 0,
    calc:  d => {
      d.title = 'Charge: ' + window.spwashi.parameters.forces.charge;
      d.width = window.spwashi.parameters.forces.charge;
    }
  },
  {
    title: 'Velocity Decay',
    x:     0,
    width: 0,
    calc:  d => d.width = window.spwashi.simulation.velocityDecay() * (window.spwashi.parameters.width || 0)
  },
  {
    title: 'Node Quantity',
    x:     0,
    width: 0,
    calc:  d => {
      let nodeCount = window.spwashi.nodes.length;
      d.title       = 'Node Count: ' + nodeCount;

      return d.width = nodeCount;
    }
  },
  {
    title: 'Node Queue Count',
    x:     0,
    width: 0,
    calc:  d => {
      const nodeCount = window.spwashi.parameters.nodes.count;

      d.title = 'Node Queue Count: ' + nodeCount;
      d.width = nodeCount;
    }
  },
  {
    title: 'Alpha Cursor',
    x:     0,
    width: 1,
    calc:  d => d.x = window.spwashi.simulation.alpha() * (window.spwashi.parameters.width || 0)
  },
  {
    title: 'Zoom',
    x:     0,
    width: 1,
    calc:  d => d.title = 'Zoom: ' + window.spwashi.zoomTransform?.k
  },
].map((r, i) => {
  r.height = 20;
  r.y      = i * 20;
  return r;
});

function initializeForces(simulation, links, nodes) {
  console.log(links)
  simulation.alpha(window.spwashi.parameters.forces.alpha);
  simulation.alphaTarget(window.spwashi.parameters.forces.alphaTarget);
  simulation.alphaDecay(window.spwashi.parameters.forces.alphaDecay);
  simulation.velocityDecay(window.spwashi.parameters.forces.velocityDecay);
  simulation.force('link', d3.forceLink().links(links).id(d => d.id).strength(l => l.strength || 1));
  simulation.force('collide', d3.forceCollide(d => d.r));
  simulation.force('charge', d3.forceManyBody().strength(window.spwashi.parameters.forces.charge));
  simulation.force('center', d3.forceCenter(...[
    window.spwashi.parameters.forces.centerPos.x,
    window.spwashi.parameters.forces.centerPos.y,
  ]).strength(window.spwashi.parameters.forces.center));
  window.spwashi.parameters.forces.boundingBox &&
  simulation.force('boundingBox', (alpha) => {
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

const simulationSVG = d3.select("svg#simulation");
const g             = simulationSVG.append('g').attr('id', 'simulation-content');

const rectsG   = g.append('g').classed('rects', true);
const linksG   = g.append('g').classed('links', true);
const circlesG = g.append('g').classed('nodes', true);

const nodeG_offset    = {x: 0, y: 0};
const nodeG_transform = {x: 0, y: 0};
window.spwashi.reinit = () => {
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
                  window.spwashi.reinit();
                } else {
                  window.spwashi.nodes.forEach(node => {
                    node.private._r = node.private._r || node.r
                    node.r          = node.private._r * e.transform.k;
                  })
                }
              }));
  }

  simulationSVG
    .call(d3
            .drag()
            .on('start', (e, node) => {
              simulationSVG.attr("cursor", "grabbing");
              nodeG_offset.x = e.x;
              nodeG_offset.y = e.y;
            })
            .on('drag', (e, node) => {
              const dx = nodeG_offset.x - e.x;
              const dy = nodeG_offset.y - e.y;

              nodeG_transform.x += dx / 10;
              nodeG_transform.y += dy / 10;

              circlesG.attr("transform", `translate(${nodeG_transform.x}, ${nodeG_transform.y})`);
              linksG.attr("transform", `translate(${nodeG_transform.x}, ${nodeG_transform.y})`);
            })
            .on('end', (e, node) => {
              simulationSVG.attr("cursor", "grab");
              nodeG_offset.x = e.x;
              nodeG_offset.y = e.y;
            })
    )


  const nodes      = window.spwashi.nodesManager.initNodes(window.spwashi.nodes);
  const links      = window.spwashi.linksManager.initLinks(window.spwashi.links, nodes);
  const rects      = window.spwashi.rectsManager.initRects(window.spwashi.rects)
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
    window.spwashi.linksManager.updateLinks(g, links);
    window.spwashi.nodesManager.updateNodes(g, nodes);
    window.spwashi.rectsManager.updateRects(g, rects);
  };
  simulation.on('tick', window.spwashi.internalTicker);
};

window.spwashi.readParameters(new URLSearchParams(window.location.search));

if (window.spwashi.doFetchNodes) {
  const fetchThing = async () => {
    const identities = await fetch('http://localhost:3000/identities').then(r => r.json());
    const tokens     = await fetch('http://localhost:3000/tokens').then(r => r.json());
    const els        = {};
    const ret        = {identities, tokens: tokens.filter(el => els[el.identity] ? false : (els[el.identity] = true))};

    return ret.tokens;
  }
  fetchThing()
    .then(nodes => window.spwashi.nodes.push(...nodes))
    .then(nodes => window.spwashi.reinit());
}

initializeForceSimulationControls();
