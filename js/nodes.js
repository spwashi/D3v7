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
const images = [
	'images/01.webp',
	'images/02.webp',
];
const getNodeColor = d => colors[(d.colorindex || 0) % (colors.length )];
const getImageHref = d => {
	const href = images[(d.colorindex || 0) % (images.length)];
	return href;
};

const getNodeStrokeColor = d => colors[((d.colorindex || 0) + 5) % colors.length];

const getNodeKey = node => window.spwashi.parameterKey + '@node.id[' + node.id + ']';
const saveNodePosition = node => window.localStorage.setItem(getNodeKey(node), JSON.stringify(node));
const readNodePosition = node => {
	const fromLocalStorage = window.localStorage.getItem(getNodeKey(node));

	if (fromLocalStorage) return JSON.parse(fromLocalStorage);

	return {}
}
const drag =
	d3.drag()
		.on('start', (e, node) => {
			node.x = e.x;
			node.y = e.y;
		})
		.on('drag', (e, node) => {
			node.fx = e.x;
			node.fy = e.y;
			console.log(node);
		})
		.on('end', (e, node) => {
			window.spwashi.tick();
			saveNodePosition(node);
		})
;



const zoom = 
	d3.zoom().on('zoom', (e, d) => {
		console.log('scroll', d.name , d.id);
		// d.r = Math.min(d.r * e.transform.k, 50); 
	});

function normalize(node) {
	node.image.r = isNaN(node.image.r) ? node.r : Math.max(20, node.image.r);
	node.image.offsetX = node.image.offsetX || 0;
	node.image.offsetY = node.image.offsetY || -node.image.r / 2;
	return node;
}


const nodesManager = {
	init:
		function makeStarterNodes(nodes, reinitCounter) {
			const count = NODE_COUNT + nodes.length;
			const len = nodes.length;
			for (let i = len; i < count; i++) {
				let node = {
					name: 'node',
					colorindex: i % 13,
					image: {
					},
					id: i,
					idx: i,
					x: X_START_POS,
					y: Y_START_POS,
					r: 10 * NODE_RADIUS_MULT
				}
				const readNode = readNodePosition(node);
				node = normalize({...node, ...readNode});
				nodes.push(node);
			}
			return nodes.sort((a, b) => b.r - a.r);
		},
	
	update: 
		function updateNodes(nodes) {
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
					.on('click', (e, d) => {
						if (event.defaultPrevented) return;
						let weight = window.spwashi.superpower.weight;
						if(e.shiftKey) {
							weight *= -1;
						}
						switch (window.spwashi.superpower.name) {
							case 'grow': {
								d.r += weight;
								break;
							}
							case 'shrink': {
								d.r -= weight;
								break;
							}
							case 'changecolor': {
								if (isNaN(d.colorindex)) d.colorindex = 1;
								d.colorindex += weight;
								break;
							}
						}
						saveNodePosition(d);
					});
				g
					.append('text')
					.text(d => d.colorindex)
					.attr('font-size', d => 13) //(d.r || 10) * NODE_RADIUS_MULT)
					.attr('x', d => d.x || 0)
					.attr('y', d => d.y || 0)

				g
					.append('rect')
					.attr('width', d => 2 * d.r)
					.attr('height', d => 2 * d.r)
				
				g
					.append('image')
					.attr('href', getImageHref)
					.attr('width', d => d.image.r || d.r)
					.attr('preserveAspectRatio', d => 'xMidYMin slice')
					.attr('height', d => d.image.r || d.r)
					.attr('x', d => d.x - d.r / 2)
					.attr('y', d => d.y - d.r / 2)
					.call(d3.drag()
						.on('start', (e, d) => {
							d.image.fx = d.image.fx || d.x;
							d.image.fy = d.image.fy || d.y;
						})
						.on('drag', (e, d) => {
							d.image.offsetX += e.dx;
							d.image.offsetY += e.dy;
						}))
					.on('click', (e, d) => {
						if (event.defaultPrevented) return;
						let weight = window.spwashi.superpower.weight;
						if(e.shiftKey) {
							weight *= -1;
						}

						switch (window.spwashi.superpower.name) {
							case 'grow': {
								d.image.r = d.image.r || d.r;
								d.image.r += weight;
								break;
							}
							case 'shrink': {
								d.image.r = d.image.r || d.r;
								d.image.r -= weight;
								break;
							}
							case 'changecolor': {
								if (isNaN(d.colorindex)) d.colorindex = 1;
								d.colorindex += weight;
								break;
							}
						}
						saveNodePosition(d);
					});



				return g;
			}

			const updateJoin = update => {
				update
					.select('circle')
					.attr('fill', getNodeColor)
					.attr('cx', d => d.x || 0)
					.attr('r', d => (d.r || 1))
					.attr('cy', d => d.y || 0)
				update
					.select('text')
					.text(d => d.colorindex)
					.attr('x', d => d.x || 0)
					.attr('y', d => d.y || 0)

				update
					.select('rect')
					.attr('stroke-width', '1px')
					.attr('fill', getNodeColor)
					.attr('stroke', getNodeStrokeColor)
					.attr('fill', 'none')
					.attr('x', d => (d.x) - (d.r))
					.attr('y', d => (d.y) - (d.r))
					
				update
					.select('image')
					.attr('href', getImageHref)
					.attr('width', d => d.image.r)
					.attr('height', d => d.image.r)
					.attr('x', d => d.x + d.image.offsetX)
					.attr('y', d => d.y + d.image.offsetY)

					
				return update;
			} 

			const removeJoin = remove => remove.remove();

			dataSelection .join(enterJoin, updateJoin, removeJoin);
		}
};
