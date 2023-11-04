const width = 400;
const height = 300;
const X_START_POS = -4900;
const Y_START_POS = -1800;
const NODE_COUNT = 13;
const CHARGE_STRENGTH = -500;
const CENTER_STRENGTH = .1;
const CENTER_POS = [width/2, height/2];

const nodes = makeStarterNodes(NODE_COUNT);
const links = makeStarterLinks(nodes);

const simulation =
	d3.forceSimulation(nodes)
		.alphaTarget(.3)
		.force('charge', d3.forceManyBody().strength(CHARGE_STRENGTH))
		.force('center', d3.forceCenter(...CENTER_POS).strength(CENTER_STRENGTH))
		.force('link', d3.forceLink().links(links))
		.on('tick', getTicker(initDragBehavior()));

function makeStarterNodes(count) {
	const nodes = [];
	for (let i = 0; i <= count; i++) {
		nodes.push({
			name: i,
			x: X_START_POS,
			y: Y_START_POS,
			r: i % 13
		});
	}
	return nodes;
}

function makeStarterLinks(nodes) {
	const links = [];
	for (let node of nodes) {
		links.push({source: 0, target: node.name});	
	}

	return links;
}
