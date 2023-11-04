const colors = ['#ffffff', '#556677'];
const getNodeColor = d => colors[(d.index || 0) % colors.length];

const nodesManager = {
	update: 
		function updateNodes(drag) {
			const dataSelection = d3.select('.nodes')
				.selectAll('g')
				.data(nodes, d => d.name)
			;
			dataSelection
				.join(
					enter => {
						const g = 
							enter.append('g')
							.classed('node', true)
							.attr('id', d => d.name);

						g
							.append('circle')
							.attr('fill', getNodeColor)
							.attr('r', d => d.r || 1)
							.attr('cx', d => d.x || 0)
							.attr('cy', d => d.y || 0)
							.call(drag);
						g
							.append('text')
							.text(d => d.name)
							.attr('font-size', d => d.r || 10)
							.attr('x', d => d.x || 0)
							.attr('y', d => d.y || 0)
						return g;
					},
					update => {
						update
							.select('circle')
							.attr('cx', d => d.x || 0)
							.attr('cy', d => d.y || 0)
						update
							.select('text')
							.attr('x', d => d.x || 0)
							.attr('y', d => d.y || 0)
						return update;
					},
					remove => remove.remove()
				);
		}
};
const linksManager = {
	update: 
		function updateLinks() {
			const u = d3.select('.links')
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
}

function getTicker(drag) {
	const updateLinks = linksManager.update;
	const updateNodes = nodesManager.update;
	function tick() {
		updateLinks();
		updateNodes(drag);
	}

	return tick;
}
