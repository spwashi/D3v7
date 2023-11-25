import {initializeForceSimulationControls}          from "./simulation/buttons";
import {initParameters, readParameters}             from "./init/parameters";
import {initSimulationRoot, reinitializeSimulation} from "./simulation/simulation";
import {onColorModeStart}                           from "./modes/mode-dataindex";
import {onReflexModeStart}                          from "./modes/mode-reflex";

const getItemKey = key => window.spwashi.parameterKey + '@' + key;


function initCallbacks() {
  window.spwashi.callbacks = window.spwashi.callbacks || {};

  window.spwashi.callbacks.arrowRight = () => {};
  window.spwashi.callbacks.arrowLeft  = () => {};
  window.spwashi.callbacks.arrowUp    = () => {};
  window.spwashi.callbacks.arrowDown  = () => {};
}

function initListeners() {
  window.spwashi.onModeChange = (mode) => {
    switch (mode) {
      case 'spw':
        window.spwashi.spwEditor?.focus();
        break;
      case 'reflex':
        onReflexModeStart();
        break;
      case 'color':
        onColorModeStart()
        break;
    }
  }

  window.spwashi.onDataIndexChange = (dataindex) => {
  };
}


function initRoot() {
  initCallbacks();
  initListeners();
  window.spwashi.counter        = 0;
  window.spwashi.readParameters = readParameters;
  window.spwashi.setItem        = (key, item, category = null) => window.localStorage.setItem(getItemKey(key), JSON.stringify(item || null))
  window.spwashi.getItem        = (key, category = null) => {
    const out = window.localStorage.getItem(getItemKey(key))
    if (out) return JSON.parse(out || '{}')
    return undefined;
  }
  initSimulationRoot();
}

export function init() {
  window.spwashi = {};
  initRoot();
  initParameters();

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
      .then(nodes => window.spwashi.nodes.push(...nodes))
      .then(nodes => reinitializeSimulation());
  }

  initializeForceSimulationControls();
}