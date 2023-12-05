import {removeAllNodes}         from "../../../simulation/nodes/data/set";
import {removeAllLinks}         from "../../../simulation/edges/data/set";
import {getDocumentDataIndex} from "../../../modes/dataindex/mode-dataindex";

import {reinit}               from "../../../simulation/reinit";

export function clearActiveNodes() {
  removeAllNodes();
  removeAllLinks();
  window.spwashi.perspectiveMap.delete(getDocumentDataIndex())
  reinit();
}