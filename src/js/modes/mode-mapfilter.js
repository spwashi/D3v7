import ace, {createEditSession} from 'ace-builds/src-noconflict/ace';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/mode-javascript';
import {reinitializeSimulation} from "../simulation/simulation";
import {setDocumentMode}        from "./index";
import {removeAllNodes}         from "../simulation/nodes/set";

export function initializeMapFilterMode() {
  function hardResetNodes(nodes) {
    removeAllNodes();
    window.spwashi.nodes.push(...nodes);
    window.spwashi.links = window.spwashi.links.filter(link => nodes.includes(link.source) && nodes.includes(link.target));
    reinitializeSimulation();
  }

  const mapEditor = ace.edit('node-mapper');
  const mapKey    = 'map-nodes-fn';
  const mapValue  = window.spwashi.getItem(mapKey) || `d => {
  d.r = (Math.random() * 30) + (Math.random() * 50);
  return d;
}`;
  mapEditor.setSession(createEditSession(mapValue, 'ace/mode/javascript'));
  window.spwashi.callbacks.onMapMode = () => {
    const mapModeContainer    = document.querySelector('#map-mode-container');
    mapModeContainer.tabIndex = 0;
    mapModeContainer.focus();
  }

  const filterEditor = ace.edit('node-filter');
  const filterKey    = 'filter-nodes-fn';
  const filterValue  = window.spwashi.getItem(filterKey) || `d => d.kind === 'nominal'`;
  filterEditor.setSession(createEditSession(filterValue, 'ace/mode/javascript'));
  window.spwashi.callbacks.onFilterMode = () => {
    const filterModeContainer    = document.querySelector('#filter-mode-container');
    filterModeContainer.tabIndex = 0;
    filterModeContainer.focus();
  }


  [filterEditor, mapEditor].forEach((editor) => {
    editor.setOptions({useWorker: false})
    editor.setTheme('ace/theme/monokai');
    editor.session.setMode('ace/mode/javascript');
    // ignore tab key
    editor.commands.bindKey('Tab', null);
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
    setDocumentMode('')
  }

  function submitFilter() {
    const filterFnString = filterEditor.getValue();
    const filterFunction = filterFnString ? eval(filterFnString) : d => true;
    const nodes          = window.spwashi.nodes.filter((node, i) => !filterFunction(node, i));

    hardResetNodes(nodes);
    window.spwashi.setItem(filterKey, filterFnString);
    setDocumentMode('')
  }
}