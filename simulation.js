const nodes = [
	{name: 'A', x: 0, y: 0},
	{name: 'B', x: 0, y: 0},
	{name: 'C', x: 0, y: 0},
	{name: 'D', x: 0, y: 0},
	{name: 'E', x: 0, y: 0},
	{name: 'F', x: 0, y: 0},
	{name: 'G', x: 0, y: 0},
	{name: 'H', x: 0, y: 0},
]

const links = [
	{source: 0, target: 1},
	{source: 0, target: 2},
	{source: 0, target: 3},
	{source: 1, target: 6},
	{source: 3, target: 4},
	{source: 3, target: 7},
	{source: 4, target: 5},
	{source: 4, target: 7}
]

const width = 400, height = 300;
const simulation =
	d3.forceSimulation(nodes)
		.alphaTarget(.3)
		.force('charge', d3.forceManyBody().strength(-100))
		.force('center', d3.forceCenter(width / 2, height / 2))
		.force('link', d3.forceLink().links(links))
		.on('tick', getTicker(initDragBehavior()));
