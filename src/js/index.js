import {initParameters, readParameters} from "./init/parameters";
import {initFocalSquare}                from "./ui/focal-point";
import {setDocumentMode}                from "./modes";
import {pushHelpTopics}                 from "./modes/spw/commands/help";
import {initCallbacks}                  from "./init/callbacks/initCallbacks";
import {initListeners}                  from "./init/listeners/initListeners";
import {initH1}                         from "./ui/h1";
import {initSimulationRoot}             from "./simulation/simulation";
import {initUi}                         from "./init/ui";


export function init() {
  window.spwashi = {};
  initParameters();
  initRoot();
  readParameters(new URLSearchParams(window.location.search));
  initFocalSquare();
  initH1();
  initUi(window.spwashi.initialMode)
}

function initRoot() {
  initSimulationRoot();
  initRootSession();
  initCallbacks();
  initListeners();
  window.spwashi.counter   = 0;
  window.spwashi.modeOrder = [
    'reflex',
    'color',
    'map',
    'filter',
    'node',
    'query',
    'debug',
    'story',
    'spw',
  ];

  if (window.location.pathname === '/help') {
    pushHelpTopics();
    window.spwashi.spwEditor.value = window.spwashi.getItem('help', 'focal.root') || '';
    setDocumentMode('spw', false, true);
  }
}

function initRootSession() {
  window.spwashi.__session = window.spwashi.__session || {i: 0};
  window.spwashi.setItem   = (key, item, category = null) => {
    window.localStorage.setItem(getItemKey(key, category), JSON.stringify(item || null));
  }
  window.spwashi.getItem   = (key, category = null) => {
    const out = window.localStorage.getItem(getItemKey(key, category))
    if (out) return JSON.parse(out || '{}')
    return undefined;
  }
}

function getItemKey(key, category = null) {
  if (!category) {
    category = window.spwashi.parameterKey
  }

  return category + '@' + key;
}
