import {initParameters, readParameters}    from "./init/parameters";
import {initFocalSquare}                   from "./ui/focal-point";
import {setDocumentMode}                   from "./modes";
import {pushHelpTopics}                    from "./modes/spw/commands/help";
import {initCallbacks}                     from "./init/callbacks/initCallbacks";
import {initListeners}                     from "./init/listeners/initListeners";
import {initH1}                            from "./ui/h1";
import {initializeForceSimulationControls} from "./ui/simulation-controls";


const getItemKey = (key, category = null) => {
  if (!category) {
    category = window.spwashi.parameterKey
  }

  return category + '@' + key;
};

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

function initRoot() {
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

  import ("./simulation/simulation")
    .then(async ({initSimulationRoot}) => {
      await initSimulationRoot();
      initializeForceSimulationControls();

      if (window.location.pathname === '/help') {
        pushHelpTopics();
        window.spwashi.spwEditor.value = window.spwashi.getItem('help', 'focal.root') || '';
        setDocumentMode('spw', false, true);
      }
    });
}

export function init() {
  window.spwashi = {};
  initRoot();
  initParameters();
  readParameters(new URLSearchParams(window.location.search));
  initFocalSquare();
  initH1();
  import('./init/ui').then(({initUi}) => initUi(window.spwashi.initialMode));

}