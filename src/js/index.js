import {initializeForceSimulationControls} from "./ui/simulation-controls";
import {initParameters, readParameters}    from "./init/parameters";
import {initSimulationRoot, reinitializeSimulation} from "./simulation/simulation";
import {initFocalSquare}                            from "./ui/focal-point";
import {setDocumentMode}                            from "./modes";
import {pushHelpTopics}                             from "./modes/spw/commands/help";
import {initCallbacks}                              from "./init/callbacks/initCallbacks";
import {initListeners}                              from "./init/listeners/initListeners";
import {initH1}   from "./ui/h1";
import {pushNode} from "./simulation/nodes/data/operate";

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

  initSimulationRoot().then(() => {
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

  window.spwashi.readParameters = readParameters;
  window.spwashi.readParameters(new URLSearchParams(window.location.search));

  if (window.spwashi.doFetchNodes) {
    const fetchThing = async () => {
      const identities = await fetch('http://localhost:3000/identities').then(r => r.json());
      const tokens     = await fetch('http://localhost:3000/tokens').then(r => r.json());
      const els        = {};
      const ret        = {identities, tokens: tokens.filter(el => els[el.identity] ? false : (els[el.identity] = true))};

      return ret.tokens;
    }
    fetchThing()
      .then(nodes => pushNode(...nodes))
      .then(nodes => reinitializeSimulation());
  }

  initializeForceSimulationControls();
  initFocalSquare();
  initH1();
}