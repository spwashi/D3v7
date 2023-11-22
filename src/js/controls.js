const generateNodes = (n) => {
  const count = n || window.spwashi.parameters.nodes.count;
  const nodes = [...Array(count)].map(n => ({}));
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
    nodes.map(window.spwashi.nodesManager.cacheNode)
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
      window.spwashi.nodesManager.cacheNode(node);
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
  const value    = window.spwashi.getItem('parameters.spw-parse-field') || '';
  const spwInput = ace.edit('spw-parse-field');
  spwInput.setValue(value);
  const button   = document.querySelector('#parse-spw');
  button.onclick = () => {
    const text   = spwInput.getValue()
    const parsed = window.spwashi.parse(text);
    window.spwashi.setItem('parameters.spw-parse-field', text);
    window.spwashi.nodes.push(...JSON.parse(JSON.stringify(parsed)));
    window.spwashi.reinit();
  }
}

function hardResetNodes(nodes) {
  window.spwashi.nodes.length = 0;
  window.spwashi.nodes.push(...nodes);
  window.spwashi.reinit();
}

function initializeNodeMapAndFilter() {
  const mapEditor = ace.edit('node-mapper');
  const mapKey    = 'map-nodes-fn';
  const mapValue  = window.spwashi.getItem(mapKey) || `d => {\n	return d;\n}`;
  mapEditor.setSession(ace.createEditSession(mapValue, 'ace/mode/javascript'));

  const filterEditor = ace.edit('node-filter');
  const filterKey    = 'filter-nodes-fn';
  const filterValue  = window.spwashi.getItem(filterKey) || `d => {\n	return true;\n}`;
  filterEditor.setSession(ace.createEditSession(filterValue, 'ace/mode/javascript'));

  [filterEditor, mapEditor].forEach((editor) => {
    editor.setTheme('ace/theme/monokai');
    editor.session.setMode('ace/mode/javascript');
  })

  const mapSubmit   = document.querySelector('#submit-node-mapper');
  mapSubmit.onclick = submitMapper;

  const filterSubmit   = document.querySelector('#submit-node-filter');
  filterSubmit.onclick = submitFilter;

  function submitMapper() {
    const mapFnString = mapEditor.getValue();
    const mapFunction = mapFnString ? eval(mapFnString) : d => d;
    const nodes       = window.spwashi.nodes.map(mapFunction);
    hardResetNodes(nodes);
    window.spwashi.setItem(mapKey, mapFnString);
  }

  function submitFilter() {
    const filterFnString = filterEditor.getValue();
    const filterFunction = filterFnString ? eval(filterFnString) : d => true;
    const nodes          = window.spwashi.nodes.filter(filterFunction);
    hardResetNodes(nodes);
    window.spwashi.setItem(filterKey, filterFnString);
  }
}

function initializeModeSelection(starterMode) {
  const modeSelect = document.querySelector('#mode-selector');
  window.spwashi.setDocumentMode(starterMode)
  modeSelect.value    = starterMode;
  modeSelect.onchange = function (e) {
    const mode = e.target.value;
    window.spwashi.setDocumentMode(mode)
  }
}

function initializeColors() {
  const colorContainer   = document.querySelector('#colors');
  colorContainer.onclick = function (e) {
    const target = e.target;
    const color  = target.dataset.dataindex;
    setColorIndex(color);
  }
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Backspace') {
    window.spwashi.nodes.length = window.spwashi.nodes.length - 1;
    window.spwashi.reinit();
  }
  if (e.key === ' ') {
    // generateNodes(e.shiftKey ? window.spwashi.parameters.nodes.count : 1);
  }
  if (!(e.metaKey || e.ctrlKey)) return;
  if (e.shiftKey) return;

  const keystrokeOptions = window.spwashi.keystrokeOptions;
  for (let option of keystrokeOptions) {
    if (e.key === option[0]) {
      e.preventDefault();
      option[2]();
    }
  }
});