const generateNodes = () => {
  const nodes = [...Array(window.spwashi.parameters.nodes.count)].map(n => ({}));
  window.spwashi.nodes.push(...nodes);
  window.spwashi.reinit();
}

function initializeForceSimulationControls() {
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
    window.spwashi.nodes.forEach(node => {
      node.fx = undefined;
      node.fy = undefined;
    });
  }

  const generateNodesButton   = document.querySelector('#controls .generate-nodes');
  generateNodesButton.onclick = generateNodes;

}

function initializeParameterContainers() {
  let items            = {};

  function traverse(item, prefix = 'window-spwashi-parameters') {
    if (typeof item === "number") return item;
    if (typeof item !== "object") throw new Error("only numbers or objects are currently configured");
    for (let key in item) {
      const value     = item[key];
      const valuekey  = prefix + '-' + key;
      const realValue = traverse(value, valuekey);
      items[valuekey] = realValue;
    }
    return undefined;
  }

  traverse(window.spwashi.parameters);
  Object.keys(items).forEach(key => items[key] === undefined && delete items[key]);

  window.spwashi.refreshNodeInputs = (nodes) => {
    const nodesSelectorFn   = (window.spwashi.getItem('parameters.nodes-input-map-fn-string') || 'data => data');
    const nodesInputElement = document.querySelector('#nodes-input');
    const nodesInputText    = window.spwashi.getItem('parameters.nodes-input') || [{r: 30}];
    nodesInputElement.value = JSON.stringify(nodesInputText, null, 2);
    nodesInputElement.rows  = 5;

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
      console.log({nodes});
      return [];
    }

    return nodes || [];
  }
  window.spwashi.refreshNodeInputs();
  window.spwashi.nodes.push(...window.spwashi.readNodeInputs().filter(window.spwashi.nodesManager.filterNode));
  window.spwashi.nodes.forEach(window.spwashi.nodesManager.processNode);
  window.spwashi.reinit();

  const _readNodeInputs = (append = true) => {
    const nodes = window.spwashi.readNodeInputs();
    if (!append) {
      window.spwashi.nodes.length = 0;
      window.spwashi.reinit();
    }
    window.spwashi.nodes.push(...nodes);
    window.spwashi.reinit();
  }

  document.querySelector('#controls button.read-nodes').onclick = () => _readNodeInputs(true);

  document.querySelector('#node-input-container button.add').onclick = () => _readNodeInputs(true);

  document.querySelector('#node-input-container button.replace').onclick = () => _readNodeInputs(false);

  document.querySelector('#controls button.save-nodes').onclick = () => {
    const nodes = window.spwashi.nodes;
    nodes.map(window.spwashi.nodesManager.saveNode)
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
      window.spwashi.nodesManager.saveNode(node);
    });
    nodes.length = 0;
    window.spwashi.reinit();
  }
}

function initializeQueryParametersQuickChange() {
  const element     = document.querySelector('#query-parameters .value');
  const text        = [...new URLSearchParams(window.location.search)].map(entry => entry.join('=')).join('\n');
  element.innerHTML = text;
  element.rows      = text.split('\n').length + 1;
  const button      = document.querySelector('#query-parameters button.go');
  button.onclick    = (e) => {
    const searchParams = new URLSearchParams(element.value.split('\n').map(line => line.split('=')))
    window.spwashi.readParameters(searchParams);
    if (e.shiftKey) {
      window.location = '?' + searchParams;
    }
  }
}

function initializeSpwParseField() {
  const element  = document.querySelector('#spw-parse-field');
  const button   = document.querySelector('#parse-spw');
  button.onclick = () => {
    const text    = element.value;
    const parsed  = window.spwashi.parse(text);
    element.value = '';
    window.spwashi.nodes.push(...JSON.parse(JSON.stringify(parsed)));
    window.spwashi.reinit();
  }
}

function initializeNodeMapAndFilter() {
  const mapFilterForm = document.querySelector('#map-filter-form');
  const mapKey        = ('map-nodes-fn');
  const filterKey     = ('filter-nodes-fn');
  const mapElement    = document.querySelector('#node-mapper');
  const filterElement = document.querySelector('#node-filter');

  mapElement.value    = window.spwashi.getItem(mapKey) || `d => {\n	return d;\n}`;
  mapElement.rows = mapElement.value.split('\n').length + 1;
  filterElement.value = window.spwashi.getItem(filterKey) || `d => {\n	return true;\n}`;
  filterElement.rows = filterElement.value.split('\n').length + 1;

  mapFilterForm.onsubmit = function (e) {
    e.preventDefault();
    const data           = new FormData(mapFilterForm);
    const mapFnString    = data.get('map');
    const filterFnString = data.get('filter');
    const mapFunction    = mapFnString ? eval(mapFnString) : d => d;
    const filterFunction = filterFnString ? eval(filterFnString) : d => true;
    const nodes          = window.spwashi.nodes.map(mapFunction).filter(filterFunction);

    window.spwashi.setItem(mapKey, mapFnString);
    console.log(window.spwashi.getItem(mapKey));
    window.spwashi.setItem(filterKey, filterFnString);

    window.spwashi.nodes.length = 0;
    window.spwashi.nodes.push(...nodes);
  }
}

document.addEventListener('keydown', (e) => {
  if (!(e.ctrlKey || e.metaKey)) return;
  if (e.key === 'g') {
    e.preventDefault();
    return generateNodes();
  }
  if (e.key === 'k') {
    e.preventDefault();
    window.spwashi.nodes.length = 0;
    window.spwashi.reinit();
  }
  if (e.key === 's') {
    e.preventDefault();
    const nodes = window.spwashi.nodes;
    nodes.map(window.spwashi.nodesManager.saveNode)
    window.spwashi.setItem('parameters.nodes-input', nodes);
    window.spwashi.setItem('parameters.nodes-input-map-fn-string', 'data => data');
    window.spwashi.refreshNodeInputs();
  }
});