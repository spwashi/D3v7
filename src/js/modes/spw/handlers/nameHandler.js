import {setNodeHash} from "../../../simulation/nodes/data/process";
import {getAllNodes} from "../../../simulation/nodes/data/selectors/multiple";

export const nameHandler = {
  regex:   /^name=(.+)/,
  handler: (sideEffects, value) => {
    const choice        = value;
    const nodes         = getAllNodes();
    const namingOptions = {
      "identity": (node) => node.identity,
      "name":     (node) => node.private.name || node.name,
      "url":      (node) => node.url,
      "hash":     (node) => setNodeHash(node),
      "pos":      (node, i) => `${i}`,
    };
    const naming        = namingOptions[choice];
    if (!naming) return;
    nodes.forEach((node, i) => {
      node.private.name = node.private.name || node.name;
      node.name         = naming(node, i) || node.name;
    });
    sideEffects.physicsChange = true;
  }
};