const nodes 		= nodesManager.init(NODE_COUNT);
const links 		= linksManager.init(nodes);
const updateLinks 	= linksManager.update;
const updateNodes 	= nodesManager.update;
const drag 		= initDragBehavior();

function tick() {
	updateLinks();
	updateNodes(drag);
}

const simulation =
	d3.forceSimulation(nodes)
		.alphaTarget(.3)
		.force('charge', d3.forceManyBody().strength(CHARGE_STRENGTH))
		.force('center', d3.forceCenter(...CENTER_POS).strength(CENTER_STRENGTH))
		.force('link', d3.forceLink().links(links))
		.on('tick', tick);
