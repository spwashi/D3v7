export function sortNodes(nodes) {
  return nodes.sort((a, b) => a.z - b.z);
}