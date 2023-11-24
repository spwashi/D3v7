export function pushLink(links, link) {
  links.push(link)
}

function initLinks(linkContainer, nodes) {
  const linkStrength = window.spwashi.parameters.links.strength;
  const doPrevLinks  = window.spwashi.parameters.links.linkPrev;
  const links        = linkContainer;

  for (let node of nodes) {
    const {head, body, tail} = node;

    const items = [head, body, tail].flat().map(i => i?.identity).filter(Boolean);
    items.forEach(item => {
      const source     = (typeof item === "string" ? item : item.identity);
      const sourceNode = window.spwashi.getNode(source);
      if (!sourceNode) {
        return;
      }
      const target = node.id;

      let bondStrength = 1;

      switch (sourceNode.kind.trim()) {
        case 'operator + delimiter + essential.open':
        case 'operator + delimiter + essential.close':
          bondStrength = 5;
          break;
        case 'operator + delimiter + locational.open':
        case 'operator + delimiter + locational.close':
          bondStrength = 5;
          break;
        case 'operator + delimiter + conceptual.open':
        case 'operator + delimiter + conceptual.close':
          bondStrength = 5;
          break;
      }
      switch (node.kind.trim()) {
        case 'phrasal':
          bondStrength = 7;
          break;
        default:
          console.log(sourceNode.kind);
      }

      const strength = linkStrength * bondStrength;
      const link     = {source, target, strength: strength};
      pushLink(links, link);
    })
  }

  return links;
}

function updateLinks(g, links) {
  const u = g.select('.links')
             .selectAll('line')
             .data(links)
             .join(
               enter => enter.append('line')
                             .attr('stroke-width', d => (d.strength || 1) * 1)
                             .attr('x1', d => d.source.x)
                             .attr('y1', d => d.source.y)
                             .attr('x2', d => d.target.x)
                             .attr('y2', d => d.target.y),
               update => update
                               .attr('x1', d => d.source.x)
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