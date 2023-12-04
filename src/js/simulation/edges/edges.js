import {linkBySpwParts} from "./data/link-spw";
import {pushLink}       from "./data/pushLink";
import {initCenterNode} from "../nodes/data/initCenterNode";

export function linkToCenter(nodes) {
  const id = initCenterNode();
  window.spwashi.reinit();
  const links = [];
  for (let node of nodes) {
    const link = {
      source:   node.id,
      target:   window.spwashi.getNode(id).id,
      strength: 0.1
    };
    pushLink(links, link);
  }
  return links;
}

function initLinks(links, nodes) {
  links.push(...linkBySpwParts(nodes))
  return links;
}

function updateLinks(g, links) {
  const u = g.select('.links')
             .selectAll('line')
             .data(links)
             .join(
               enter => enter.append('line')
                             .attr('stroke-width', d => (d.strength || 1) * 13)
                             .attr('x1', d => d.source.x)
                             .attr('y1', d => d.source.y)
                             .attr('x2', d => d.target.x)
                             .attr('y2', d => d.target.y),
               update => update
                 .attr('x1', d => d.source.x)
                 .attr('data-colorindex', d => 'spwashi-stroke-' + d.colorindex)
                 .attr('y1', d => d.source.y)
                 .attr('x2', d => d.target.x)
                 .attr('y2', d => d.target.y),
               exit => exit.remove()
             )

}

export const EDGE_MANAGER = {
  initLinks:   initLinks,
  updateLinks: updateLinks,
};