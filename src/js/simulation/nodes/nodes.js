import {processNode}                      from "./data/process.js";
import {cacheNode, readNodePosition}      from "./data/store";
import {makeText, updateNodeTextSvg}      from "./ui/text";
import {makeRect}                         from "./ui/rect";
import {makeCircle, updateCircle}         from "./ui/circle";
import {makeImage, updateNodeImage}       from "./ui/image";
import {getNodeColor, getNodeStrokeColor} from "./attr/colors";
import {setNodeData}                      from "./data/set";
import {sortNodes}                        from "./data/sort";
import {normalize}                        from "./data/normalize";
import {getNode}                          from "./data/selectors/single";
import {getNodeId}                        from "./attr/id";
import {filterNode}                       from "./data/filter";

export const NODE_MANAGER = {
  getNode:     getNode,
  initNodes:   init,
  normalize:   normalize,
  updateNodes: update,
  filterNode:  filterNode,
  processNode: processNode,
  cacheNode:   cacheNode,
};

function init(nodes) {
  const count = nodes.length;
  for (let i = 0; i < count; i++) {
    const node     = {id: getNodeId(nodes[i], i),};
    const readNode = readNodePosition(node);

    NODE_MANAGER.normalize(
      nodes[i],
      i,
      {...node, ...readNode},
    );
  }
  const activeNodes = sortNodes(nodes);
  setNodeData(activeNodes);
  return activeNodes;
}

function update(g, nodes) {
  const wrapperSelection =
          g
            .select('.nodes')
            .selectAll('g.wrapper')
            .data(nodes, d => d.id);

  const enterJoin  = enter => {
    const outerG = enter.append('g').classed('wrapper', true);
    const image  = outerG.append('g').classed('image', true);
    const node   = outerG.append('g').classed('node', true);
    const text   = outerG.append('g').classed('text', true)
    makeImage(image);
    makeCircle(node);
    makeRect(node);
    makeText(text);
    return outerG;
  }
  const updateJoin = outerG => {
    const update = outerG.select('g.node');
    const image  = outerG.select('g.image');
    const text   = outerG.select('g.text');

    updateCircle(update);
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
    remove.select('g.text').remove();
    remove.select('g.image').remove();
  }

  wrapperSelection.join(enterJoin, updateJoin, removeJoin);
}