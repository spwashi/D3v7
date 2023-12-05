export function removeAllLinks() {
  window.spwashi.links.length = 0;
}

export function removeNodeEdges(d) {
  window.spwashi.links = window.spwashi.links.filter(link => {
    return link.source !== d && link.target !== d;
  });
}

export function removeObsoleteEdges(nodes) {
  window.spwashi.links = window.spwashi.links.filter(link => nodes.includes(link.source) && nodes.includes(link.target));
}