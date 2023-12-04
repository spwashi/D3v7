import {generateNodes} from "../simulation/nodes/data/generate";
import {forEachNode}   from "../simulation/nodes/data/operate";

export function initializeForceSimulationControls() {
  const forceSimulation = window.spwashi.simulation;
  if (!forceSimulation) {
    const error = 'no force simulation initialized';
    alert(error)
    throw new Error(error);
  }

  const tickButton   = document.querySelector('#controls .tick');
  tickButton.onclick = () => {
    window.spwashi.tick();
  };

  const startButton   = document.querySelector('#controls .start');
  startButton.onclick = () => {
    forceSimulation.restart();
  };

  const stopButton   = document.querySelector('#controls .stop');
  stopButton.onclick = () => {
    forceSimulation.stop();
  };

  const reinitButton   = document.querySelector('#controls .reinit');
  reinitButton.onclick = () => {
    window.spwashi.reinit();
  };

  const clearFixedButton   = document.querySelector('#controls .clear-fixed-positions');
  clearFixedButton.onclick = () => {
    forEachNode(node => {
      node.fx = undefined;
      node.fy = undefined;
    });
  }

  const generateNodesButton   = document.querySelector('#controls .generate-nodes');
  generateNodesButton.onclick = generateNodes;
}