import {initializeForceSimulationControls}                                             from "./simulation/buttons";
import {initParameters, readParameters}                                                from "./init/parameters";
import {initSimulationRoot, reinitializeSimulation}                                    from "./simulation/simulation";
import {onColorModeStart}                                                              from "./modes/mode-dataindex";
import {onReflexModeStart}                                                             from "./modes/mode-reflex";
import {attachFocalPointToElementPosition, focalPoint, initFocalSquare, setFocalPoint} from "./focalPoint";
import {getIdentityPath}                                                               from "./simulation/nodes/processNode";
import md5                                                                             from "md5";
import {parse}                                                                         from "../vendor/spw/parser/parse.mjs";
import {getNextUrlSearchParams}                                                        from "./init/keystrokes";

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
      if (document.body.dataset.interfaceDepth === 'main-menu') {
        attachFocalPointToElementPosition(button);
      } else {
        if (!focalPoint.fx) {
          setFocalPoint({
                          x: window.innerWidth * 0.2,
                          y: window.innerHeight * 0.75,
                        });
        }
      }
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

function initH1() {
  const h1          = document.querySelector('h1');
  const currentText = h1.innerText;

  h1.tabIndex  = 0;
  h1.onkeydown = (e) => {
    if (e.target !== h1) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      h1.click();
    }
  }
  h1.onclick   = () => {
    const form  = document.createElement('form');
    const input = document.createElement('input');
    input.value = currentText;
    input.id    = 'h1-input';
    form.appendChild(input);
    const submit     = document.createElement('button');
    submit.type      = 'submit';
    submit.innerText = 'Submit';
    form.appendChild(submit);
    h1.innerHTML = '';
    h1.appendChild(form);
    input.focus();
    // select all text
    input.setSelectionRange(0, input.value.length);
    submit.onclick = (e) => {
      e.preventDefault();
      const value = input.value;
      console.log({value});
      const parsed = JSON.parse(JSON.stringify(parse(value)));
      const params = getNextUrlSearchParams();
      params.set('title', parsed.identity);
      let href = getIdentityPath(md5(parsed.identity), params);
      console.log(href);
      window.location.href = href;
    }
  }
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
  initializeForceSimulationControls();
  initFocalSquare();
  initH1();
}