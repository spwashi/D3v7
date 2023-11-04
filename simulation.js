const width = 400;
const height = 300;
const X_START_POS = -4900;
const Y_START_POS = -1800;

const nodes = makeStarterNodes(13);
const links = makeStarterLinks(nodes);

const simulation =
	d3.forceSimulation(nodes)
		.alphaTarget(.3)
		.force('charge', d3.forceManyBody().strength(-500))
		.force('center', d3.forceCenter(width / 2, height / 2).strength(.02))
		.force('link', d3.forceLink().links(links))
		.on('tick', getTicker(initDragBehavior()));

function makeStarterNodes(count) {
	const nodes = [];
	for (let i = 0; i <= count; i++) {
		nodes.push({
			name: i,
			x: X_START_POS,
			y: Y_START_POS,
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
