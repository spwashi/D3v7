window.spwashi = window.spwashi || {};
window.spwashi.simulation = d3.forceSimulation();
window.spwashi.nodes = window.spwashi.nodes || [];

d3.select("svg#simulation") 
	.attr('width', window.spwashi.parameters.width)
	.attr('height', window.spwashi.parameters.height)

window.spwashi.reinit = 
	() => {
		const linkContainer = [];
		const nodes = window.spwashi.nodesManager.init(window.spwashi.nodes);
		const links = window.spwashi.linksManager.init([], nodes);
		const simulation = window.spwashi.simulation;
		simulation.nodes(nodes);
		simulation.alphaTarget(0.1);
		simulation.force('link', d3.forceLink().links(links).id(d => d.id).strength(l => l.strength || 1));
		simulation.force('collide', d3.forceCollide(d => d.r));
		simulation.force('charge', d3.forceManyBody().strength(window.spwashi.parameters.forces.charge));
		simulation.force('center', d3.forceCenter(...CENTER_POS).strength(window.spwashi.parameters.forces.center));

		window.spwashi.tick = 
			() => {
				simulation.alphaTarget(0.1);
				simulation.alpha(.5);
				simulation.tick(1);
				window.spwashi.internalTicker();
			};

		window.spwashi.internalTicker =
			() => {
				window.spwashi.linksManager.update(links);
				window.spwashi.nodesManager.update(nodes);
			};

		simulation.on('tick', window.spwashi.internalTicker);
	};

window.spwashi.readParameters(new URLSearchParams(window.location.search));
if (window.spwashi.doFetchNodes)  {
	const fetchThing = async () => {
		const identities = await fetch('http://localhost:3000/identities').then(r => r.json());
		const tokens = await fetch('http://localhost:3000/tokens').then(r => r.json());
		const els = {};
		const ret = {identities, tokens: tokens.filter(el => els[el.identity] ? false : (els[el.identity] = true))};

		return ret.tokens;
	}
	fetchThing()
		.then(nodes => window.spwashi.nodes.push(...nodes))
		.then(nodes => window.spwashi.reinit());
}

initializeForceSimulationControls();
