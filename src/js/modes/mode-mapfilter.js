import ace, {createEditSession} from 'ace-builds/src-noconflict/ace';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/mode-javascript';
import {reinitializeSimulation} from "../simulation/simulation";

export function initializeNodeMapAndFilter() {
  function hardResetNodes(nodes) {
    window.spwashi.nodes.length = 0;
    window.spwashi.nodes.push(...nodes);
    reinitializeSimulation();
  }

  const mapEditor = ace.edit('node-mapper');
  const mapKey    = 'map-nodes-fn';
  const mapValue  = window.spwashi.getItem(mapKey) || `d => {\n	return d;\n}`;
  mapEditor.setSession(createEditSession(mapValue, 'ace/mode/javascript'));

  const filterEditor = ace.edit('node-filter');
  const filterKey    = 'filter-nodes-fn';
  const filterValue  = window.spwashi.getItem(filterKey) || `d => {\n	return true;\n}`;
  filterEditor.setSession(createEditSession(filterValue, 'ace/mode/javascript'));

  [filterEditor, mapEditor].forEach((editor) => {
    editor.setOptions({useWorker: false})
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