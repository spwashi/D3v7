const colors = ['#ffffff', '#556677'];
const getNodeColor = d => colors[(d.index || 0) % colors.length];

const nodesManager = {
	init:
		function makeStarterNodes(count) {
			const nodes = [];
			for (let i = 0; i <= count; i++) {
				nodes.push({
					name: i,
					x: X_START_POS,
					y: Y_START_POS,
					r: ((i || 1) % 13) * NODE_RADIUS_MULT
				});
			}
			return nodes;
		},
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
							.attr('r', d => (d.r || 1))
							.attr('cx', d => d.x || 0)
							.attr('cy', d => d.y || 0)
							.call(drag);
						g
							.append('text')
							.text(d => d.name)
							.attr('font-size', d => (d.r || 10) * NODE_RADIUS_MULT)
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
