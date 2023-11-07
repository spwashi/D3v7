const colors = [
	'var(--node-color-0)',
	'var(--node-color-1)',
	'var(--node-color-2)',
	'var(--node-color-3)',
	'var(--node-color-4)',
	'var(--node-color-5)',
	'var(--node-color-6)',
	'var(--node-color-7)',
	'var(--node-color-8)',
	'var(--node-color-9)',
	'var(--node-color-10)',
	'var(--node-color-11)',
	'var(--node-color-12)',
];
const getNodeColor = d => colors[(d.index || 0) % colors.length];
const getNodeKey = node => 'node.id[' + node.id + ']';
const saveNodePosition = node => window.localStorage.setItem(getNodeKey(node), JSON.stringify(node));
const readNodePosition = node => {
	const fromLocalStorage = window.localStorage.getItem(getNodeKey(node));

	if (fromLocalStorage) return JSON.parse(fromLocalStorage);

	return {}
}
const drag =
	d3.drag()
		.on('start', dragStarted)
		.on('drag', dragging)
		.on('end', dragEnded)
;

function dragStarted(e, node) {
	node.x = e.x;
	node.y = e.y;
}
function dragging(e, node){
	node.fx = e.x;
	node.fy = e.y;
}
function dragEnded(e, node){
	window.spwashi.tick();
	saveNodePosition(node);
	// node.fx = undefined;
	// node.fy = undefined;
}

const nodesManager = {
	init:
		function makeStarterNodes(nodes, reinitCounter, ) {
			const count = NODE_COUNT + nodes.length;
			for (let i = nodes.length; i <= count; i++) {
				let node = {
					name: 'node',
					id: i,
					idx: i,
					x: X_START_POS,
					// fx: X_START_POS,
					y: Y_START_POS,
					r: 12 * NODE_RADIUS_MULT
				}
				const readNode = readNodePosition(node);
				node = {...node, ...readNode}
				nodes.push(node);
				console.log()
			}
			return nodes.sort((a, b) => b.r - a.r);
		},
	
	update: 
		function updateNodes(nodes, zoom) {
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
					.attr('font-size', d => 13) //(d.r || 10) * NODE_RADIUS_MULT)
					.attr('x', d => d.x || 0)
					.attr('y', d => d.y || 0)

				g
					.append('rect')
					.attr('width', d => d.r)
					.attr('height', d => d.r)

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

				update
					.select('rect')
					.attr('stroke-width', '1px')
					.attr('stroke', getNodeColor)
					.attr('fill', 'none')
					.attr('x', d => d.x + d.r * 5)
					.attr('y', d => d.y + d.r * 5)
				return update;
			} 

			const removeJoin = remove => remove.remove();

			dataSelection .join(enterJoin, updateJoin, removeJoin);
		}
};
