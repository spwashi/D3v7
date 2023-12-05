import {NODE_MANAGER}     from "./nodes/nodes";
import {forceSimulation}  from "d3";
import {getNodeImageHref} from "./nodes/attr/href";
import {getDefaultRects}  from "./rects/data/default";
import {reinit}           from "./reinit";


function initNodes() {
  window.spwashi.clearCachedNodes = () => {
    window.spwashi.setItem('nodes', []);
  }
  window.spwashi.getNodeImageHref = getNodeImageHref;
  window.spwashi.getNode          = NODE_MANAGER.getNode;
  window.spwashi.nodes            = [];
}

function initEdges() {
  window.spwashi.links = [];
}

function initRects() {
  window.spwashi.rects = getDefaultRects();
}

export async function initSimulationRoot() {
  window.spwashi.simulation = forceSimulation();
  window.spwashi.reinit     = reinit;

  initNodes();
  initEdges();
  initRects();
}