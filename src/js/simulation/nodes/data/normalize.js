import {getDocumentDataIndex} from "../../../modes/dataindex/util";

export function normalize(node, i, override) {
  const template = {
    image:      {},
    callbacks:  {},
    charge:     0,
    parts:      {},
    private:    {},
    text:       {fontSize: 20},
    r:          1 * window.spwashi.parameters.nodes.radiusMultiplier,
    z:          0,
    x:          window.spwashi.parameters.startPos.x + i * 2,
    y:          window.spwashi.parameters.startPos.y,
    colorindex: getDocumentDataIndex(),
  };
  Object.assign(
    node,
    template,
    override,
    {
      name: node.identity || ('node:' + i),
      idx:  i,
    },
    {
      ...node,
    }
  );
  node.r             = Math.max(node.r, 1)
  node.image.r       = isNaN(node.image.r) ? node.r : Math.max(10, node.image.r);
  node.image.offsetX = !isNaN(node.image.offsetX) ? node.image.offsetX : 0;
  node.image.offsetY = !isNaN(node.image.offsetY) ? node.image.offsetY : node.r;
  return node;
}