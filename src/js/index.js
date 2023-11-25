import {initializeForceSimulationControls}           from "./simulation/buttons";
import {initParameters, readParameters}              from "./init/parameters";
import {reinitializeSimulation}                      from "./simulation/simulation";
import {getNodeImageHref, NODE_MANAGER}                                from "./simulation/nodes/nodes";
import {getDataIndexForNumber, getDocumentDataIndex, onColorModeStart} from "./modes/mode-dataindex";
import {onReflexModeStart}                                             from "./modes/mode-reflex";

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

  window.spwashi.clearCachedNodes = () => {
    window.spwashi.setItem('nodes', []);
  }
  window.spwashi.reinit           = reinitializeSimulation;
  window.spwashi.simulation       = d3.forceSimulation();
  window.spwashi.counter          = 0;
  window.spwashi.getNodeImageHref = getNodeImageHref;
  window.spwashi.getNode          = NODE_MANAGER.getNode;
  window.spwashi.readParameters   = readParameters;
  window.spwashi.setItem          = (key, item, category = null) => window.localStorage.setItem(getItemKey(key), JSON.stringify(item || null))
  window.spwashi.getItem          = (key, category = null) => {
    const out = window.localStorage.getItem(getItemKey(key))
    if (out) return JSON.parse(out || '{}')
    return undefined;
  }
  window.spwashi.nodes            = window.spwashi.nodes || [];
  window.spwashi.links            = window.spwashi.links || [];
  window.spwashi.rects            = window.spwashi.rects || [
    {
      title: 'Counter',
      x:     0,
      width: 0,
      calc:  d => d.width = window.spwashi.counter * 1
    },
    {
      title: 'Alpha',
      x:     0,
      width: 0,
      calc:  d => d.width = window.spwashi.simulation.alpha() * (window.spwashi.parameters.width || 0)
    },
    {
      title: 'Alpha Decay',
      x:     0,
      width: 0,
      calc:  d => d.width = window.spwashi.simulation.alphaDecay() * (window.spwashi.parameters.width || 0)
    },
    {
      title: 'Charge',
      x:     0,
      width: 0,
      calc:  d => {
        d.title = 'Charge: ' + window.spwashi.parameters.forces.charge;
        d.width = window.spwashi.parameters.forces.charge;
      }
    },
    {
      title: 'Velocity Decay',
      x:     0,
      width: 0,
      calc:  d => d.width = window.spwashi.simulation.velocityDecay() * (window.spwashi.parameters.width || 0)
    },
    {
      title: 'Node Quantity',
      x:     0,
      width: 0,
      calc:  d => {
        let nodeCount = window.spwashi.nodes.length;
        d.title       = 'Node Count: ' + nodeCount;

        return d.width = nodeCount;
      }
    },
    {
      title: 'Node Queue Count',
      x:     0,
      width: 0,
      calc:  d => {
        const nodeCount = window.spwashi.parameters.nodes.count;

        d.title = 'Node Queue Count: ' + nodeCount;
        d.width = nodeCount;
      }
    },
    {
      title: 'Alpha Cursor',
      x:     0,
      width: 1,
      calc:  d => d.x = window.spwashi.simulation.alpha() * (window.spwashi.parameters.width || 0)
    },
    {
      title: 'Zoom',
      x:     0,
      width: 1,
      calc:  d => d.title = 'Zoom: ' + window.spwashi.zoomTransform?.k
    },
  ].map((r, i) => {
    r.height = 20;
    r.y      = i * 20;
    return r;
  });
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