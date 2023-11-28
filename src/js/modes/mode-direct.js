import {NODE_MANAGER}           from "../simulation/nodes/nodes";
import {reinitializeSimulation} from "../simulation/simulation";

export function initializeDirectMode() {
  window.spwashi.refreshNodeInputs = (nodes) => {
    const nodesSelectorFn   = (window.spwashi.getItem('parameters.nodes-input-map-fn-string') || 'data => data');
    const nodesInputElement = document.querySelector('#nodes-input');
    const nodesInputText    = window.spwashi.getItem('parameters.nodes-input') || [];
    nodesInputElement.value = JSON.stringify(nodesInputText, null, 2);

    document.querySelector('#nodes-selector-fn').value = nodesSelectorFn;
  };
  window.spwashi.readNodeInputs    = () => {
    const input = document.querySelector('#nodes-input')?.value;
    if (!input) {
      window.spwashi.setItem('parameters.nodes-input', null);
      return reject();
    }
    const mapFnInput  = document.querySelector('#nodes-selector-fn');
    const mapFnString = mapFnInput?.value || 'data => data';

    const mapFn  = eval(mapFnString);
    const parsed = JSON.parse(input);
    const nodes  = mapFn(parsed);

    if (!Array.isArray(nodes)) {
      console.error('not nodes');
      return [];
    }

    console.log(...nodes)
    return nodes || [];
  }
  window.spwashi.refreshNodeInputs();
  window.spwashi.nodes.push(...window.spwashi.readNodeInputs().filter(NODE_MANAGER.filterNode));
  window.spwashi.nodes.forEach(NODE_MANAGER.processNode);
  reinitializeSimulation();

  const _readNodeInputs = (append = true) => {
    const nodes = window.spwashi.readNodeInputs();
    if (!append) {
      window.spwashi.nodes.length = 0;
      reinitializeSimulation();
    }
    window.spwashi.nodes.push(...nodes);
    reinitializeSimulation();
  }

  document.querySelector('#controls button.read-nodes').onclick = () => _readNodeInputs(true);

  document.querySelector('#node-input-container button.add').onclick = () => _readNodeInputs(true);

  document.querySelector('#node-input-container button.replace').onclick = () => _readNodeInputs(false);

  document.querySelector('#controls button.save-nodes').onclick = () => {
    const nodes = window.spwashi.nodes;
    nodes.map(NODE_MANAGER.cacheNode)
    window.spwashi.setItem('parameters.nodes-input', nodes);
    window.spwashi.setItem('parameters.nodes-input-map-fn-string', 'data => data');
    window.spwashi.refreshNodeInputs();
  }

  document.querySelector('#controls button.clear-saved-nodes').onclick = () => {
    const nodes = window.spwashi.nodes;
    nodes.map(node => {
      const id = node.id;
      for (let prop in node) {
        delete node[prop];
      }
      node.id = id;
      NODE_MANAGER.cacheNode(node);
    });
    nodes.length = 0;
    reinitializeSimulation();
  }
}