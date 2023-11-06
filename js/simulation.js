const simulation = d3.forceSimulation();
const updateLinks 	= linksManager.update;
const updateNodes 	= nodesManager.update;
const drag 		= initDragBehavior();
const zoom 		= initZoomBehavior();
const svg = d3.select("svg#simulation").attr('width', width).attr('height', height)

simulation.force('collide', d3.forceCollide(d => d.r))
simulation.force('charge', d3.forceManyBody().strength(CHARGE_STRENGTH));
simulation.force('center', d3.forceCenter(...CENTER_POS).strength(CENTER_STRENGTH));
let temp = 0;
let nodeContainer = [];
window.spwashi 			= window.spwashi || {};
window.spwashi.simulation 	= simulation;
window.spwashi.reinit 		= () => {
	console.log(temp);
	const nodes = nodesManager.init(nodeContainer, temp++);
	const links = linksManager.init(nodes);
	simulation.nodes(nodes);
	simulation.alphaTarget(0.1);
	simulation.force('link', d3.forceLink().links(links).strength(l => l.strength || 1));
	window.spwashi.internalTicker = () => {
		updateLinks(links);
		updateNodes(nodes, drag, zoom);
	}
	simulation.on('tick', window.spwashi.internalTicker);
}

window.spwashi.tick 		= () => {
	simulation.alphaTarget(0.1);
	simulation.alpha(1);
	simulation.tick(1);
	window.spwashi.internalTicker();
}
window.spwashi.reinit();
