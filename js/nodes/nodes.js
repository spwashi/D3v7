const nodesManager = {
  getNode:     getNode,
  initNodes:   initNodes,
  normalize:   normalize,
  updateNodes: updateNodes,
  filterNode:  filterNode,
  processNode: processNode,
  cacheNode:   cacheNode,
};

const idMap = new Map();

function getNodeImageHref(d) {
  return null;
  if (d.image.href === null) return null;
  return d.image.href || window.spwashi.images[(d.colorindex || 0) % (window.spwashi.images.length)];
}

function sortNodes(nodes) {
  return nodes.sort((a, b) => a.z - b.z);
}

function getNodeId(node, i) {
  const root_id = getNodeRootId(node, i);
  const set     = idMap.get(root_id) || new Set;
  if (!set.has(node)) {
    const set_id = root_id + (set.size ? '[' + set.size + ']' : '');
    node.id      = set_id;
    set.add(node);
  }
  node.id = node.id || root_id;
  idMap.set(node.id, set);
  return node.id;
}

function getNodeRootId(node = {}, i = 0) {
  if (node.identity) return node.identity;
  const indexedName = `node:[${i}]`;
  return indexedName;
};

function normalize(node, readNode, i) {
  const template = {
    image:      {},
    text:       {fontSize: 20},
    r:          1 * window.spwashi.parameters.nodes.radiusMultiplier,
    z:          0,
    x:          window.spwashi.parameters.startPos.x + i * 2,
    y:          window.spwashi.parameters.startPos.y,
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
      idx:  i,
    },
    {
      ...node,
    }
  );
  node.r             = Math.max(node.r, 1)
  node.private       = {};
  node.image.r       = isNaN(node.image.r) ? node.r : Math.max(10, node.image.r);
  node.image.offsetX = !isNaN(node.image.offsetX) ? node.image.offsetX : 0;
  node.image.offsetY = !isNaN(node.image.offsetY) ? node.image.offsetY : node.r;
  return node;
}

function initNodes(nodes) {
  const count = nodes.length;
  for (let i = 0; i < count; i++) {
    const node     = {id: getNodeId(nodes[i], i),};
    const readNode = readNodePosition(node);

    window.spwashi.nodesManager.normalize(
      nodes[i],
      {...node, ...readNode},
      i
    );
  }

  const activeNodes = sortNodes(nodes);
  return window.spwashi.nodes = activeNodes;
}

function updateNodes(g, nodes) {
  const wrapperSelection =
          g
            .select('.nodes')
            .selectAll('g.wrapper')
            .data(nodes, d => d.id);

  const enterJoin  = enter => {
    const outerG = enter.append('g').classed('wrapper', true);
    const image  = outerG.append('g').classed('image', true);
    const node   = outerG.append('g').classed('node', true);
    const text   = outerG.append('text').classed('text', true)
    makeImage(image);
    makeCircle(node);
    makeRect(node);
    makeText(text);
    return outerG;
  }
  const updateJoin = outerG => {
    const update = outerG.select('g.node');
    const image  = outerG.select('g.image');
    const text   = outerG.select('text.text');

    // removeAll(update, {filterImage: true});

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

  wrapperSelection.join(enterJoin, updateJoin, removeJoin);
}

function filterNode(node) {
  return true;
}

function processNode(node, i) {
  const readNode = readNodePosition(node);
  if (readNode.fx || readNode.fy) return;
  if (!node.identity) return;
  if (node.kind === 'nominal') return;

  const fx           = window.spwashi.values.fx?.[i] || node.fx || undefined;
  const fy           = window.spwashi.values.fy?.[i] || node.fy || undefined;
  const r            = window.spwashi.values.r?.[i] || node.r || window.spwashi.parameters.nodes.radiusMultiplier || undefined;
  const fontSize     = window.spwashi.values.text?.fontSize?.[i] || node.text?.fontSize || undefined;
  node.fx            = fx;
  node.fy            = fy;
  node.r             = r;
  node.text          = node.text || {};
  node.text.fontSize = fontSize;
  node.image         = node.image || {};
  node.image.r       = 100;
  node.image.offsetX = 0;
  node.image.offsetY = 0;
  node.md5           = node.identity && md5(node.identity);

  const edgeLeft   = 50;
  const edgeRight  = window.spwashi.parameters.width - 50;
  const edgeBottom = window.spwashi.parameters.height - 50;
  const discreteY  = edgeBottom - 100;
  const quantY     = [50, 50 + edgeBottom / 4, 50 + edgeBottom / 2, 50 + 3 * edgeBottom / 4, edgeBottom];
  const quantX     = [50, 50 + edgeRight / 4, 50 + edgeRight / 2, 50 + 3 * edgeRight / 4, edgeRight];

  switch (node.kind?.split(' + ')[0]) {
    case 'container':
      node.text.fontSize = 10;
      node.fx            = quantX[4];
      node.y             = 0;
      node.colorindex    = 3;
      break;
  }
  switch (node.kind?.trim().split(' + ').reverse()[0]) {
    case 'conceptual':
      // node.fy = 100;
      break;
    case 'essential':
      // node.fy = 200;
      break;
    case 'structural':
      // node.fy = 700;
      break;
    case 'locational':
      // node.fy = 300;
      break;
    case 'nominal':
      node.fx = quantX[2];
      break;
    case 'conceptual.open':
      node.fy = quantY[0];
      node.fx = edgeLeft;
      break;
    case 'conceptual.close':
      node.fy = quantY[0];
      node.fx = edgeRight;
      break;
    case 'locational.open':
      node.fy = quantY[4];
      node.fx = edgeLeft;
      break;
    case 'locational.close':
      node.fy = quantY[4];
      node.fx = edgeRight;
      break;
    case 'structural.open':
      node.fy = quantY[2];
      node.fx = edgeLeft;
      break;
    case 'structural.close':
      node.fy = quantY[2];
      node.fx = edgeRight;
      break;
    case 'essential.open':
      node.fy = quantY[1];
      node.fx = edgeLeft;
      break;
    case 'essential.close':
      node.fy = quantY[1];
      node.fx = edgeRight;
      break;
    case 'ordinal':
      if (node.kind.split(' + ').includes('operator')) {
        node.fy = 0;
        node.fx = 0;
        break;
      }
      node.fx = quantX[3];
      break;
    case 'phrasal':
      node.colorindex = 0;
      node.fx         = quantX[3];
      break;
    case 'binding':
      if (node.kind.split(' + ').includes('operator')) {
        break;
      }
      node.colorindex = 3;
      node.fx         = 100
      break;
    default:
      node.colorindex = node.colorindex || 2;
      break;
  }
}

function getNode(id) {
  return window.spwashi.nodes.find(n => n.id === id);
}

window.spwashi.getNodeImageHref = getNodeImageHref
window.spwashi.getNode          = nodesManager.getNode;
window.spwashi.nodesManager     = nodesManager;
