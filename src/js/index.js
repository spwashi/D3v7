import {initializeForceSimulationControls}                                             from "./simulation/buttons";
import {initParameters, readParameters}                                                from "./init/parameters";
import {initSimulationRoot, reinitializeSimulation}                                    from "./simulation/simulation";
import {onColorModeStart}                                                              from "./modes/mode-dataindex";
import {onReflexModeStart}                                                             from "./modes/mode-reflex";
import {attachFocalPointToElementPosition, focalPoint, initFocalSquare, setFocalPoint} from "./focalPoint";

const getItemKey = key => window.spwashi.parameterKey + '@' + key;

function initCallbacks() {
  window.spwashi.callbacks = window.spwashi.callbacks || {};

  window.spwashi.callbacks.arrowRight = () => {};
  window.spwashi.callbacks.arrowLeft  = () => {};
  window.spwashi.callbacks.arrowUp    = () => {};
  window.spwashi.callbacks.arrowDown  = () => {};
}

function resetArrows() {
  const noop                          = () => {};
  window.spwashi.callbacks.arrowUp    = noop;
  window.spwashi.callbacks.arrowDown  = noop;
  window.spwashi.callbacks.arrowLeft  = noop;
  window.spwashi.callbacks.arrowRight = noop;
}

document.body.addEventListener('mousedown', (e) => {
  if (e.target.tagName === 'BUTTON') return;
  if (e.target.tagName === 'CIRCLE') return;
  if (document.body.dataset.interfaceDepth !== 'standard') return;
  initFocalSquare();
  const notFixed = focalPoint.fx === undefined || focalPoint.fy === undefined;
  notFixed && setFocalPoint({x: e.x, y: e.y});
}, true);

function resetInterfaceDepth() {
  document.body.dataset.interfaceDepth = 'standard'
}

function initListeners() {
  window.spwashi.onModeChange = (mode, direct = false) => {
    if (mode) {
      window.spwashi.setItem('mode', mode);
    }
    document.querySelector('[data-mode-action] [aria-selected="true"]')?.setAttribute('aria-selected', 'false');
    const button = document.querySelector(`#mode-selector--${mode}`);
    if (button) {
      button.setAttribute('aria-selected', 'true');
      initFocalSquare();
      attachFocalPointToElementPosition(button);
    }
    resetArrows();
    switch (mode) {
      case 'spw':
        const spwModeContainer    = document.querySelector('#spw-mode-container');
        spwModeContainer.tabIndex = 0;
        direct && spwModeContainer.focus();
        break;
      case 'reflex':
        onReflexModeStart();
        break;
      case 'color':
        onColorModeStart()
        break;
      case 'story':
        const storyModeContainer = document.querySelector('#story-mode-container');
        const buttonContainer    = storyModeContainer.querySelector('.button-container button');
        buttonContainer.focus();
        buttonContainer.onfocus = () => buttonContainer.tabIndex = 0;
        break;
      case 'node':
        const nodeInputContainer    = document.querySelector('#node-input-container');
        nodeInputContainer.tabIndex = 0;
        nodeInputContainer.focus();
        nodeInputContainer.onfocus = () => nodeInputContainer.tabIndex = 0;
        break;
    }
    resetInterfaceDepth();
  }

  window.spwashi.onDataIndexChange = (dataindex) => {
  };
}

function initRootSession() {
  window.spwashi.__session = window.spwashi.__session || {i: 0};
}

function initRoot() {
  initRootSession();
  initCallbacks();
  initListeners();
  window.spwashi.counter        = 0;
  window.spwashi.modeOrder      = [
    'reflex',
    'color',
    'map',
    'filter',
    'node',
    'query',
    'debug',
    'story',
    'spw',
  ]
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
  initFocalSquare();
  initializeForceSimulationControls();
}