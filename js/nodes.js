const colors = ['#ffffff', '#556677'];
const getNodeColor = d => colors[(d.index || 0) % colors.length];

const nodesManager = {
	init:
		function makeStarterNodes(nodes, reinitCounter, ) {
			const count = NODE_COUNT + nodes.length;
			for (let i = nodes.length; i <= count; i++) {
				nodes.push({
					name: 'node',
					id: i,
					idx: i,
					x: X_START_POS,
					y: Y_START_POS,
					r: 12 * NODE_RADIUS_MULT
				});
			}
			return nodes;
		},
	
	update: 
		function updateNodes(nodes, drag, zoom) {
			const dataSelection = 
				d3.select('.nodes')
					.selectAll('g')
					.data(nodes, d => d.id);

			const enterJoin = enter => {
				const g = 
					enter.append('g')
					.classed('node', true)
					.attr('id', d => d.id);

				g
					.append('circle')
					.attr('fill', getNodeColor)
					.attr('r', d => (d.r || 1))
					.attr('cx', d => d.x || 0)
					.attr('cy', d => d.y || 0)
					.call(drag)
					.call(zoom)
				g
					.append('text')
					.text(d => d.name)
					.attr('font-size', d => (d.r || 10) * NODE_RADIUS_MULT)
					.attr('x', d => d.x || 0)
					.attr('y', d => d.y || 0)
				return g;
			}

			const updateJoin = update => {
				update
					.select('circle')
					.attr('cx', d => d.x || 0)
					.attr('r', d => (d.r || 1))
					.attr('cy', d => d.y || 0)
				update
					.select('text')
					.text(d => d.name)
					.attr('x', d => d.x || 0)
					.attr('y', d => d.y || 0)
				return update;
			} 

			const removeJoin = remove => remove.remove();

			dataSelection .join(enterJoin, updateJoin, removeJoin);
		}
};
