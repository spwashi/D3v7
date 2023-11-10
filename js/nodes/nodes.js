const sortNodes = nodes => nodes.sort((a, b) => a.z - b.z);
let ACTIVE_NODES = [];
const idMap = new Map();
const getNodeId = (node, i) => {
	const root_id = getNodeRootId(node, i);
	const set = idMap.get(root_id) || new Set;
	if (!set.has(node)) {
		const set_id = root_id + (set.size ? '[' + set.size + ']' : '');
		node.id = set_id;
		set.add(node);
	}
	node.id = node.id || root_id;
	idMap.set(node.id, set);
	return node.id;
}

window.spwashi.getNodeId = getNodeId;
window.spwashi.getNode = (id) => window.spwashi.nodes.find(n => n.id === id);
function getNodeRootId (node = {}, i = 0) {
	if (node.id) return node.id
	if (node.identity) return node.identity;
	const indexedName = `node:[${i}]`;
	return indexedName;
};
function normalize(node,readNode, i) {
	const template = {
		image: { },
		text: {},
		r: 10 * NODE_RADIUS_MULT,
		colorindex: i % 13,
	};
	const fixedPos = {
		fx: null && X_START_POS + i * 20,
		fy: null && Y_START_POS +(node.identity?.length ? (node.identity?.length * 2) : 0),
	}
	Object.assign(
		node,
		template,
		readNode,
		// fixedPos,
		{
			name: node.identity || ('node:' + i),
			idx: i,
			x: X_START_POS + i * 2,
			y: Y_START_POS,
			z: 0,
			r: 10 * NODE_RADIUS_MULT,
			colorindex: i % 13,
		}, 
		{...node}
	); 
	node.r = Math.max(node.r, 10)
	node.image.r = isNaN(node.image.r) ? node.r : Math.max(20, node.image.r);
	node.image.offsetX = node.image.offsetX || 0;
	node.image.offsetY = node.image.offsetY || -node.image.r / 2;
	return node;
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

window.spwashi.nodesManager =  {
	normalize: normalize,
	saveNode: saveNodePosition,
	init: function makeStarterNodes(nodes) {
			const count = nodes.length;
			for (let i = 0; i < count; i++) {
				let node = { id: getNodeId(nodes[i], i), } 
				const readNode = readNodePosition(node);
				let out = window.spwashi.nodesManager.normalize(nodes[i], {...node, ...readNode}, i);
			}
			const activenodes = sortNodes(nodes);
			ACTIVE_NODES = activenodes;
		console.log(activenodes);
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

				updateNodeTextSvg(text);

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
				image
					.select('rect')	
					.attr('x', d => d.x + d.image.offsetX)
					.attr('stroke', 'black')
					.attr('stroke-width', '20')
					.attr('y', d => d.y + d.image.offsetY)


					
				return outerG;
			} 

			const removeJoin = remove => {
				remove.select('g.node').remove();
				remove.select('text.text').remove();
				remove.select('g.image').remove();
			}

			dataSelection .join(enterJoin, updateJoin, removeJoin);
		}
};
