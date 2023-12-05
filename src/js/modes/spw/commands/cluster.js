import {removeClusterNodes} from "../../../simulation/nodes/data/set";
import {pushNode}           from "../../../simulation/nodes/data/operate";
import {pushLink}           from "../../../simulation/edges/data/pushLink";

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
  Object.entries(nodeGroups)
        .forEach(([cluster, nodes]) => {
          const clusterNode = {
            identity: cluster,
            kind:     '__cluster',
            r:        100,
          };
          pushNode(clusterNode);
          nodes.forEach(node => {
            pushLink(window.spwashi.links, {source: clusterNode, target: node, strength: 1});
          });
        });
  sideEffects.physicsChange = true;
}