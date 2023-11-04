const width = 400, height = 300;

const nodes = makeStarterNodes(13);
const links = makeStarterLinks(nodes);
const simulation =
	d3.forceSimulation(nodes)
		.alphaTarget(.3)
		.force('charge', d3.forceManyBody().strength(-500))
		.force('center', d3.forceCenter(width / 2, height / 2))
		.force('link', d3.forceLink().links(links))
		.on('tick', getTicker(initDragBehavior()));

function makeStarterNodes(count) {
	const nodes = [];
	for (let i = 0; i <= count; i++) {
		nodes.push({name: i, x: 0, y: 0});
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
