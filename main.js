var width = 400, height = 300

var nodes = [
	{name: 'A', x: 0, y: 0},
	{name: 'B', x: 0, y: 0},
	{name: 'C', x: 0, y: 0},
	{name: 'D', x: 0, y: 0},
	{name: 'E', x: 0, y: 0},
	{name: 'F', x: 0, y: 0},
	{name: 'G', x: 0, y: 0},
	{name: 'H', x: 0, y: 0},
]

var links = [
	{source: 0, target: 1},
	{source: 0, target: 2},
	{source: 0, target: 3},
	{source: 1, target: 6},
	{source: 3, target: 4},
	{source: 3, target: 7},
	{source: 4, target: 5},
	{source: 4, target: 7}
]

var simulation =
	d3.forceSimulation(nodes)
		.alphaTarget(.3)
		.force('charge', d3.forceManyBody().strength(-100))
		.force('center', d3.forceCenter(width / 2, height / 2))
		.force('link', d3.forceLink().links(links))
		.on('tick', ticked);


const drag = d3.drag()
			.on('start', dragStarted)
			.on('drag', dragging)
			.on('end', dragEnded)

function dragStarted(e, node) {
	console.log(name, arguments);
}
function dragging(e, node){
	node.x = e.x;
	node.y = e.y;
}
function dragEnded(e, node){
	console.log(name, arguments);
}

function updateLinks() {
	var u = d3.select('.links')
		.selectAll('line')
		.data(links)
		.join('line')
		.attr('x1', function(d) {
			return d.source.x
		})
		.attr('y1', function(d) {
			return d.source.y
		})
		.attr('x2', function(d) {
			return d.target.x
		})
		.attr('y2', function(d) {
			return d.target.y
		});
}

function updateNodes() {
	const dataSelection = d3.select('.nodes')
		.selectAll('g')
		.data(nodes, d => d.name)
	;
	dataSelection
		.join(
			enter => 
				enter.append('g')
					.classed('node', true)
					.attr('id', d => d.name)	
					.append('circle')
					.attr('r', 10)
					.attr('cx', d => d.x)
					.attr('cy', d => d.y)
					.call(drag)
			,
			update => update
				.select('circle')
				.attr('cx', d => d.x)
				.attr('cy', d => d.y)
			,
			remove => remove.remove()
		);

}

function ticked() {
	updateLinks();
	updateNodes();
}

