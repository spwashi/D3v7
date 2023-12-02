export function pushLink(links, link) {
  links.push(link)
}

export function linkBySpwParts(nodesFromSpw) {
  const links        = [];
  const linkStrength = window.spwashi.parameters.links.strength;
  let hasError       = false;
  for (let targetNode of nodesFromSpw) {
    if (!(targetNode.identity && targetNode.parts)) continue;

    const {head, body, tail} = targetNode.parts;

    const items = [head, body, tail].flat().map(i => i?.identity).filter(Boolean);
    items.forEach(item => {
      const source     = (typeof item === "string" ? item : item.identity);
      const toggle     = !!window.spwashi.parameters.perspective;
      const sourceNode = window.spwashi.getNode(
        source,
        toggle ? targetNode.colorindex : undefined
      );
      if (!sourceNode) {
        hasError = true;
        return;
      }

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
      switch (targetNode.kind.trim()) {
        case 'phrasal':
          bondStrength = 7;

          break;
      }

      const strength = linkStrength * bondStrength;
      const link     = {
        source:   sourceNode.id,
        target:   targetNode.id,
        strength: strength
      };
      pushLink(links, link);
    })
  }
  if (hasError) {
    console.error(nodesFromSpw);
  }
  return links;
}

export function linkToCenter(nodes) {
  const center                    = 'center';
  window.spwashi.nodes.centerNode = window.spwashi.nodes.centerNode || {
    identity:        center,
    r:               0,
    collisionRadius: 100,
    x:               window.spwashi.parameters.width / 2,
    y:               window.spwashi.parameters.height / 2,
  };
  window.spwashi.nodes.push(window.spwashi.nodes.centerNode);
  window.spwashi.reinit();
  const links = [];
  for (let node of nodes) {
    const link = {
      source:   node.id,
      target:   window.spwashi.getNode(center).id,
      strength: 0.1
    };
    pushLink(links, link);
  }
  return links;
}

function initLinks(linkContainer, nodes) {
  linkContainer.push(...linkBySpwParts(nodes))
  return linkContainer;
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