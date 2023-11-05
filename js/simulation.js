const nodes 		= nodesManager.init();
const links 		= linksManager.init(nodes);
const updateLinks 	= linksManager.update;
const updateNodes 	= nodesManager.update;
const drag 		= initDragBehavior();

function tick() {
	updateLinks();
	updateNodes(drag);
}

const svg = 
	d3.select("svg#simulation")
		.attr('width', width)
		.attr('height', height)

const simulation = d3.forceSimulation();
simulation.nodes(nodes);
simulation.alphaTarget(0.1);
simulation.on('tick', tick);
simulation.force('link', d3.forceLink().links(links).strength(l => l.strength || 1));
simulation.force('collide', d3.forceCollide(d => d.r))
simulation.force('charge', d3.forceManyBody().strength(CHARGE_STRENGTH));
simulation.force('center', d3.forceCenter(...CENTER_POS).strength(CENTER_STRENGTH));

window.spwashi = window.spwashi || {};
window.spwashi.simulation = simulation;
window.spwashi.tick = () => {
	simulation.alphaTarget(0.1);
	simulation.alpha(1);
	simulation.tick(1);
	tick();
}
