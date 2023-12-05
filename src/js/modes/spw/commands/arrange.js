import {getAllNodes} from "../../../simulation/nodes/data/selectors/multiple";

export function runArrangeCommand(sideEffects) {
  const nodes  = getAllNodes();
  const width  = window.spwashi.parameters.width;
  const height = window.spwashi.parameters.height;
  nodes.forEach((node, i) => {
    node.x = (i % 5) * width / 5;
    node.y = Math.floor(i / 5) * height / 5;
  });
  sideEffects.nodesImpacted = nodes;
  sideEffects.physicsChange = true;
}