const sortNodes = nodes => nodes.sort((a, b) => a.z - b.z);
let ACTIVE_NODES = [];

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
const getNodeText = d => JSON.stringify({
	name: d.name,
	z: d.z,
}, null, 3);
const getImageHref = d => images[(d.colorindex || 0) % (images.length)];
const getNodeStrokeColor = d => colors[((d.colorindex || 0) + 5) % colors.length];
const getNodeKey = node => window.spwashi.parameterKey + '@node.id[' + node.id + ']';
const saveNodePosition = node => {
	window.localStorage.setItem(getNodeKey(node), JSON.stringify(node));
	console.log('saved', node);
}
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
function makeCircle(g) {
	return g
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
				case 'z': {
					d.z = d.z || 0;
					d.z += weight;
					sortNodes(ACTIVE_NODES);
					break;
				}
			}
			saveNodePosition(d);
		});
}
function makeRect(g) {
	return g
		.append('rect')
		.attr('width', d => 2 * d.r)
		.attr('height', d => 2 * d.r)
}
function makeImage(g) {
	return g
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
}
function makeText(text) {
	text.attr('x', d => d.x)

	text.selectAll('tspan')
		.data(d => getNodeText(d).split('\n').map((line, i) => ({node:d, i: i, text: line}))) 
		.join(
			enter => enter.append('tspan') .attr('text-anchor', 'start') .attr('dy', 10) .attr('dx', 0) ,
			update => update.selectAll('tspan').text(d => d.text),
			d =>d.selectAll('tspan').remove()
		)
	return text;
}
const makeAll = 
	(g, {filterImage = false, filterRect = false, filterCircle = false, filterText = false}) => [
		!filterCircle && makeCircle,
		!filterRect && makeRect,		
		!filterImage && makeImage,
		!filterText && makeText,
	].filter(Boolean).forEach(fn => fn(g));
const removeAll = 
	(g, {filterImage = false, filterRect = false, filterCircle = false, filterText = false}) => [
		!filterCircle && (update => update.select('circle').remove()),
		!filterText && (update => update.select('text').remove()),
		!filterRect && (update => update.select('rect').remove()),
		!filterImage &&(update => update.select('image').remove()),
	].filter(Boolean).forEach(fn => fn(g));
function normalize(node) {
	node.image.r = isNaN(node.image.r) ? node.r : Math.max(20, node.image.r);
	node.image.offsetX = node.image.offsetX || 0;
	node.image.offsetY = node.image.offsetY || -node.image.r / 2;
	return node;
}
const nodesManager = {
	init: function makeStarterNodes(nodes, reinitCounter) {
			const count = NODE_COUNT + nodes.length;
			const len = nodes.length;
			for (let i = len; i < count; i++) {
				let node = {
					name: 'node[' + i + ']',
					z:0,
					id: i,
					idx: i,
					x: X_START_POS,
					y: Y_START_POS,
					r: 10 * NODE_RADIUS_MULT,
					colorindex: i % 13,
					image: { },
				}
				const readNode = readNodePosition(node);
				node = normalize({...node, ...readNode});
				nodes.push(node);
			}
			const activenodes = sortNodes(nodes);
			ACTIVE_NODES = activenodes;
			return ACTIVE_NODES;
		},
	
	update: 
		function updateNodes(nodes) {
			const dataSelection = d3.select('.nodes').selectAll('g.wrapper').data(nodes, d => d.id);

			const enterJoin = enter => {
				const outerG 	= enter.append('g').classed('wrapper', true);
				const node 	= outerG.append('g').classed('node', true);
				const text 	= outerG.append('text').classed('text', true)
				const image 	= outerG.append('g').classed('image', true);
				makeAll(node, {
					filterImage: true,
					filterCircle: false,
					filterText: true,
					filterRect: false,
				})

				makeAll(image, {
					filterImage: false,
					filterCircle: true,
					filterText: true,
					filterRect: true,
				})
				makeAll(text, {
					filterImage: true,
					filterCircle: true,
					filterText: false,
					filterRect: true,
				})
				return outerG;
			}

			const updateJoin = outerG => {
				const update = outerG.select('g.node');
				const image = outerG.select('g.image');
				const text = outerG.select('text.text');

				// removeAll(update, {filterImage: true});
				// makeAll(update, {filterImage: true});

				update
					.select('circle')
					.attr('fill', getNodeColor)
					.attr('cx', d => d.x || 0)
					.attr('r', d => (d.r || 1))
					.attr('cy', d => d.y || 0)

				const tspans = text
					.attr('x', d => (d.x || 0) - d.r)
					.attr('y', d => (d.y || 0) - d.r)
					.selectAll('tspan')
					.data(d => getNodeText(d).split('\n').map((line, i) => ({node:d, i: i, text: line}))) 
					.text(d => (d.text))
					.attr('x', d => d.node.x + d.node.r);

				update
					.select('rect')
					.attr('stroke-width', '1px')
					.attr('fill', getNodeColor)
					.attr('stroke', getNodeStrokeColor)
					.attr('fill', 'none')
					.attr('x', d => (d.x) - (d.r))
					.attr('y', d => (d.y) - (d.r))
					
				image
					.select('image')
					.attr('href', getImageHref)
					.attr('width', d => d.image.r)
					.attr('height', d => d.image.r)
					.attr('x', d => d.x + d.image.offsetX)
					.attr('y', d => d.y + d.image.offsetY)

					
				return outerG;
			} 

			const removeJoin = remove => {
				remove.select('g.node').remove();
			}

			dataSelection .join(enterJoin, updateJoin, removeJoin);
		}
};
