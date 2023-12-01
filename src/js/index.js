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

function resetArrows() {
  const noop                          = () => {};
  window.spwashi.callbacks.arrowUp    = noop;
  window.spwashi.callbacks.arrowDown  = noop;
  window.spwashi.callbacks.arrowLeft  = noop;
  window.spwashi.callbacks.arrowRight = noop;
}

let focalSquare;
let focalSquarePosition = {x: 0, y: 0};

function initFocalSquare() {
  if (!focalSquare) {
    focalSquare    = document.createElement('button');
    focalSquare.id = 'focal-square';
    focalSquare.classList.add('focal-square');
    document.documentElement.appendChild(focalSquare);
  }
  focalSquare.onclick = () => {
    window.spwashi.boon().then(result => {
      focalSquare.onclick = () => {
        window.spwashi.bane(result);
        focalSquare.onclick = () => {
          window.spwashi.bonk(result);
        };
      }
    });

  }
  return focalSquare;
}

function attachFocalPointToElementPosition(button) {
  const x      = button.getBoundingClientRect().x;
  const y      = button.getBoundingClientRect().y;
  const w      = button.getBoundingClientRect().width;
  const h      = button.getBoundingClientRect().height;
  const focalX = x + w;
  const focalY = y + h;

  focalSquarePosition = {x: focalX, y: focalY};
  document.documentElement.style.setProperty('--focal-x', focalX + 'px');
  document.documentElement.style.setProperty('--focal-y', focalY + 'px');
}

document.body.addEventListener('mousedown', (e) => {
  if (e.target.tagName === 'BUTTON') return;
  if (e.target.tagName === 'CIRCLE') return;
  if (document.body.dataset.interfaceDepth !== 'standard') return;
  initFocalSquare();
  document.documentElement.style.setProperty('--focal-x', (e.x) + 'px');
  document.documentElement.style.setProperty('--focal-y', (e.y) + 'px');
}, true);

function initListeners() {
  window.spwashi.onModeChange = (mode, direct = false) => {
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
  }

  window.spwashi.onDataIndexChange = (dataindex) => {
  };
}


function initRoot() {
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

  initializeForceSimulationControls();
}