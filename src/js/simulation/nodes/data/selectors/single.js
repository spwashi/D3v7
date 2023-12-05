export function getNode(id, perspective = undefined) {
  let fallback;
  const node = window.spwashi.nodes.find(n => {
    if (n.identity === id) {
      fallback = fallback || n;
      if (perspective === undefined) return true;
      return n.colorindex === perspective;
    }
    if (n.id === id) {
      fallback = fallback || n;
    }
  });
  return node || fallback;
}