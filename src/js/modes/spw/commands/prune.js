import {getAllNodes} from "../../../simulation/nodes/data/selectors/multiple";

export function runPruneCommand() {
  getAllNodes()
    .forEach(node => {
      node.x = Math.random() * window.spwashi.parameters.width;
      node.y = Math.random() * window.spwashi.parameters.height;
    });
}