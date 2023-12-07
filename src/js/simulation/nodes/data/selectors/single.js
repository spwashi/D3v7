import {getAllNodes} from "./multiple";

export function getNode(id, perspective = undefined) {
  let fallback;
  const node = getAllNodes().find(n => {
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