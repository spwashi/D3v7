import {getDataIndexForNumber, initializeDataindexMode, setDocumentDataIndex} from "../modes/mode-dataindex";
import {initializeDirectMode}                                                 from "../modes/mode-direct";
import {initializeQuerystringMode}                                            from "../modes/mode-querystring";
import {initializeMapFilterMode}                                              from "../modes/mode-mapfilter";
import {initializeSpwParseField}                                              from "../modes/mode-spw";
import {initializeModeSelection, setDocumentMode}                             from "../modes";
import {initKeystrokes}                                                       from "./keystrokes";
import {initializeReflexMode}                                                 from "../modes/mode-reflex";

export function initParameters() {
  window.spwashi.parameters                        = window.spwashi.parameters || {};
  window.spwashi.parameters.dataIndex              = window.spwashi.parameters.dataIndex || null;
  window.spwashi.parameters.width                  = window.spwashi.parameters.width || window.innerWidth * .9;
  window.spwashi.parameters.height                 = window.spwashi.parameters.height || window.innerHeight * .9;
  window.spwashi.parameters.startPos               = window.spwashi.parameters.startPos || {};
  window.spwashi.parameters.startPos.x             = window.spwashi.parameters.startPos.x || window.spwashi.parameters.width / 2;
  window.spwashi.parameters.startPos.y             = window.spwashi.parameters.startPos.y || window.spwashi.parameters.height / 2;
  window.spwashi.parameters.links                  = window.spwashi.parameters.links || {};
  window.spwashi.parameters.links.strength         = window.spwashi.parameters.links.strength || .1;
  window.spwashi.parameters.nodes                  = window.spwashi.parameters.nodes || {};
  window.spwashi.parameters.nodes.count            = window.spwashi.parameters.nodes.count || 13;
  window.spwashi.parameters.nodes.radiusMultiplier = window.spwashi.parameters.nodes.radiusMultiplier || 30;
  window.spwashi.parameters.forces                 = window.spwashi.parameters.forces || {};
  window.spwashi.parameters.forces.alpha           = window.spwashi.parameters.forces.alpha || 1;
  window.spwashi.parameters.forces.alphaTarget     = window.spwashi.parameters.forces.alphaTarget || .3;
  window.spwashi.parameters.forces.alphaDecay      = window.spwashi.parameters.forces.alphaDecay || .03;
  window.spwashi.parameters.forces.velocityDecay   = window.spwashi.parameters.forces.velocityDecay || .03;
  window.spwashi.parameters.forces.charge          = window.spwashi.parameters.forces.charge || 10;
  window.spwashi.parameters.forces.center          = window.spwashi.parameters.forces.center || 1;
  window.spwashi.parameters.forces.boundingBox     = typeof window.spwashi.parameters.forces.boundingBox !== 'undefined' ? window.spwashi.parameters.forces.boundingBox : true;
  window.spwashi.parameters.forces.centerPos       = window.spwashi.parameters.forces.centerPos || {};
  window.spwashi.parameters.forces.centerPos.x     = window.spwashi.parameters.forces.centerPos.x || window.spwashi.parameters.startPos.x;
  window.spwashi.parameters.forces.centerPos.y     = window.spwashi.parameters.forces.centerPos.y || window.spwashi.parameters.startPos.y;
}

export function readParameters(searchParameters) {
  [...searchParameters.entries()].forEach(([key, value]) => (document.querySelector(`[name=${key}]`) || {}).value = value)

  window.spwashi.parameters           = window.spwashi.parameters || {};
  window.spwashi.values               = window.spwashi.values || {};
  window.spwashi.values.fy            = [];
  window.spwashi.values.r             = [];
  window.spwashi.values.text          = window.spwashi.values.text || {}
  window.spwashi.values.text.fontSize = window.spwashi.values.text.fontSize || [];
  window.spwashi.superpower           = window.spwashi.superpower || {};
  window.spwashi.parameters.links     = window.spwashi.parameters.links || {};
  window.spwashi.parameters.forces    = window.spwashi.parameters.forces || {};
  window.spwashi.version              = searchParameters.get('version');
  window.spwashi.parameterKey         = `simulation.parameters#${window.spwashi.version}`;

  let mode;

  if (searchParameters.has('display')) {
    document.body.dataset.displaymode = searchParameters.get('display');
  }
  if (searchParameters.has('reset')) {
    window.localStorage.clear();
  }
  if (searchParameters.has('ncount')) {
    window.spwashi.parameters.nodes       = window.spwashi.parameters.nodes || {};
    window.spwashi.parameters.nodes.count = +searchParameters.get('ncount');
  }
  if (searchParameters.has('linkstrength')) {
    window.spwashi.parameters.links.strength = +searchParameters.get('linkstrength');
  }
  if (searchParameters.has('charge')) {
    window.spwashi.parameters.forces.charge = +searchParameters.get('charge');
  }
  if (searchParameters.has('linkprev')) {
    window.spwashi.parameters.links.linkPrev = +searchParameters.get('linkprev');
  } else {
    window.spwashi.parameters.links.linkPrev = 0;
  }
  if (searchParameters.has('width')) {
    window.spwashi.parameters.width = +searchParameters.get('width');
  }
  if (searchParameters.has('size')) {
    window.spwashi.parameters.width  = +searchParameters.get('size').split(',')[0];
    window.spwashi.parameters.height = +searchParameters.get('size').split(',')[0];
  }
  if (searchParameters.has('height')) {
    window.spwashi.parameters.height = +searchParameters.get('height');
  }
  if (searchParameters.has('center')) {
    let [x, y]                                 = (searchParameters.get('center').split(',').map(n => +n));
    window.spwashi.parameters.startPos         = {x: 2, y: 2};
    window.spwashi.parameters.forces.centerPos = {x, y};
  }
  if (searchParameters.has('alpha')) {
    window.spwashi.parameters.forces.alpha = +searchParameters.get('alpha');
  }
  if (searchParameters.has('alphaTarget')) {
    window.spwashi.parameters.forces.alphaTarget = +searchParameters.get('alphaTarget');
  }
  if (searchParameters.has('alphaDecay')) {
    window.spwashi.parameters.forces.alphaDecay = +searchParameters.get('alphaDecay');
  }
  if (searchParameters.has('velocityDecay')) {
    window.spwashi.parameters.forces.velocityDecay = +searchParameters.get('velocityDecay');
  }
  if (searchParameters.has('zoom')) {
    window.spwashi.parameters.canzoom = !!(+searchParameters.get('zoom'));
  } else {
    window.spwashi.parameters.canzoom = true;
  }

  if (searchParameters.has('superpower')) {
    window.spwashi.superpower.name = searchParameters.get('superpower');
  }
  if (searchParameters.has('weight')) {
    window.spwashi.superpower.weight = parseInt(searchParameters.get('weight') || 1);
  }
  if (searchParameters.has('mode')) {
    mode = searchParameters.get('mode');
    setDocumentMode(mode);
  }
  if (searchParameters.has('fx')) {
    window.spwashi.values.fx = searchParameters.get('fx').split(',').map(n => +n);
  }
  if (searchParameters.has('fy')) {
    window.spwashi.values.fy = searchParameters.get('fy').split(',').map(n => +n);
  }
  if (searchParameters.has('r')) {
    window.spwashi.values.r = searchParameters.get('r').split(',').map(n => +n);
  }
  if (searchParameters.has('defaultRadius')) {
    window.spwashi.parameters.nodes.radiusMultiplier = +searchParameters.get('defaultRadius');
  }
  if (searchParameters.has('fontSize')) {
    window.spwashi.values.text.fontSize = searchParameters.get('fontSize').split(',').map(n => +n);
  }
  if (searchParameters.has('dofetch')) {
    window.spwashi.doFetchNodes = searchParameters.get('dofetch') === '1'
  }
  if (searchParameters.has('boundingbox')) {
    window.spwashi.parameters.forces.boundingBox = searchParameters.get('boundingbox') === '1'
  }
  if (searchParameters.has('dataindex')) {
    window.spwashi.parameters.dataIndex = +searchParameters.get('dataindex');
    setDocumentDataIndex(getDataIndexForNumber(window.spwashi.parameters.dataIndex));
  }

  initializeDirectMode();
  initializeQuerystringMode();
  initializeMapFilterMode();
  initializeSpwParseField();
  initializeReflexMode();
  initializeModeSelection(mode);
  initializeDataindexMode();

  initKeystrokes();
}