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
window.spwashi.getNodeImageHref = d => d.image.href || window.spwashi.images[(d.colorindex || 0) % (window.spwashi.images.length)];
window.spwashi.getNode = (id) => window.spwashi.nodes.find(n => n.id === id);
function getNodeRootId (node = {}, i = 0) {
	if (node.identity) return node.identity;
	const indexedName = `node:[${i}]`;
	return indexedName;
};
function normalize(node,readNode, i) {
	const template = {
		image: { 
		},
		text: {fontSize: 20},
		r: 1 * window.spwashi.parameters.nodes.radiusMultiplier,
		z: 0,
		x: window.spwashi.parameters.startPos.x + i * 2,
		y: window.spwashi.parameters.startPos.y,
		colorindex: i % 13,
	};
	const fixedPos = {
		fx: null && window.spwashi.parameters.startPos.x + i * 20,
		fy: null && window.spwashi.parameters.startPos.y + (node.identity?.length ? (node.identity?.length * 2) : 0),
	}
	Object.assign(
		node,
		template,
		readNode,
		// fixedPos,
		{
			name: node.identity || ('node:' + i),
			idx: i,
		}, 
		{...node}
	); 
	node.r = Math.max(node.r, 1)
	node.image.r = isNaN(node.image.r) ? node.r : Math.max(10, node.image.r);
	node.image.offsetX = node.image.offsetX || -node.image.r * 2 ;
	node.image.offsetY = node.image.offsetY || -node.image.r * 5 ;
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
				updateNodeImage(image);
				update
					.select('rect')
					.attr('stroke-width', '1px')
					.attr('fill', getNodeColor)
					.attr('stroke', getNodeStrokeColor)
					.attr('fill', 'none')
					.attr('x', d => (d.x) - (d.r))
					.attr('y', d => (d.y) - (d.r))
					
				


					
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
