import {NODE_MANAGER}                          from "./nodes/nodes";
import {EDGE_MANAGER}                          from "./edges/edges";
import {RECT_MANAGER}                          from "./rects/rects";
import {initializeForces}                      from "./forces";
import {initSvgProperties, simulationElements} from "./basic";


// todo this is large, consider dynamic import
export function reinit() {
  initSvgProperties(simulationElements.svg);

  window.spwashi.counter = 0;

  const nodes = NODE_MANAGER.initNodes(window.spwashi.nodes);
  const edges = EDGE_MANAGER.initLinks(nodes);
  const rects = RECT_MANAGER.initRects(window.spwashi.rects);

  const simulation = window.spwashi.simulation;
  simulation.nodes(nodes);

  initializeForces();

  window.spwashi.tick           = () => {
    simulation.tick(1);
    window.spwashi.internalTicker();
  };
  window.spwashi.internalTicker = () => {
    window.spwashi.counter += 1;
    rects.forEach(d => d.calc(d));
    EDGE_MANAGER.updateLinks(simulationElements.wrapper, edges);
    NODE_MANAGER.updateNodes(simulationElements.wrapper, nodes);
    RECT_MANAGER.updateRects(simulationElements.wrapper, rects);
  };

  simulation.on('tick', window.spwashi.internalTicker);

  const outputElement = document.querySelector('#output');
  if (!outputElement) {
    window.spwashi.callbacks.acknowledgeLonging('wondering about output');
    return;
  }
  outputElement.innerHTML = JSON.stringify(window.spwashi.parameters, null, 2);
}