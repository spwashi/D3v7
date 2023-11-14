window.spwashi            = window.spwashi || {};
window.spwashi.simulation = d3.forceSimulation();
window.spwashi.counter    = 0;
window.spwashi.nodes      = window.spwashi.nodes || [];
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
    calc:  d => d.width = window.spwashi.parameters.forces.charge
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
      d.title = 'Node Count: ' + nodeCount;

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
].map((r, i) => {
  r.height = 20;
  r.y      = i * 20;
  return r;
});

window.spwashi.reinit = () => {
  window.spwashi.counter = 0;
  d3.select("svg#simulation")
    .attr('width', window.spwashi.parameters.width)
    .attr('height', window.spwashi.parameters.height)

  const nodes      = window.spwashi.nodesManager.init(window.spwashi.nodes);
  const links      = window.spwashi.linksManager.init([], nodes);
  const rects      = window.spwashi.rectsManager.init(window.spwashi.rects)
  const simulation = window.spwashi.simulation;

  simulation.nodes(nodes);
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

  window.spwashi.tick           =
    () => {
      simulation.tick(1);
      window.spwashi.internalTicker();
    };
  window.spwashi.internalTicker =
    () => {
      window.spwashi.counter += 1;
      rects.forEach(d => d.calc(d));
      window.spwashi.linksManager.update(links);
      window.spwashi.nodesManager.update(nodes);
      window.spwashi.rectsManager.update(rects);
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
