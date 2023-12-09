import {initSimulationRoot} from "../simulation/simulation";
import {initCallbacks}      from "./callbacks/initCallbacks";
import {initListeners}      from "./listeners/initListeners";
import {pushHelpTopics}     from "../modes/spw/commands/help";
import {setDocumentMode}    from "../modes";

export function initRoot() {
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

  window.spwashi.soundsEnabled = false;
  window.spwashi.sounds        = {};
  window.spwashi.playSound     = sound => {
    if (window.spwashi.soundsEnabled) {
      const getSound = window.spwashi.sounds[sound];
      if (!getSound) return;
      const audio = getSound();
      audio.play();
    }
  }

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