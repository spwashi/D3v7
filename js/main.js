function getTicker(drag) {
	function tick() {
		updateLinks();
		updateNodes(drag);
	}

	return tick;
}

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
					.attr('r', 10)
					.attr('cx', d => d.x)
					.attr('cy', d => d.y)
					.call(drag);
				g
					.append('text')
					.text(d => d.name)
					.attr('x', d => d.x)
					.attr('y', d => d.y)
				return g;
			},
			update => {
				update
					.select('circle')
					.attr('cx', d => d.x)
					.attr('cy', d => d.y)
				update
					.select('text')
					.attr('x', d => d.x)
					.attr('y', d => d.y)
				return update;
			},
			remove => remove.remove()
		);
}
