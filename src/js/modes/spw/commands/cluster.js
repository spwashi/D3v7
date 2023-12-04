import {removeClusterNodes} from "../../../simulation/nodes/set";

function getCluster(node) {
  return 'cluster:' + node.colorindex;
}

export function runClusterCommand(sideEffects) {
  const nodeGroups = window.spwashi.nodes.reduce((acc, node) => {
    const cluster = getCluster(node);
    acc[cluster]  = acc[cluster] || [];
    acc[cluster].push(node);
    return acc;
  }, {});
  removeClusterNodes();
  window.spwashi.links = window.spwashi.links.filter(link => link.source.kind !== '__cluster' && link.target.kind !== '__cluster');
  Object.entries(nodeGroups)
        .forEach(([cluster, nodes]) => {
          const clusterNode = {
            identity: cluster,
            kind:     '__cluster',
            r:        100,
          };
          window.spwashi.nodes.push(clusterNode);
          nodes.forEach(node => {
            window.spwashi.links.push({source: clusterNode, target: node, strength: 1});
          });
        });
  sideEffects.physicsChange = true;
}