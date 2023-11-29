import {getDataIndexForNumber, initializeDataindexMode, setDocumentDataIndex} from "../modes/mode-dataindex";
import {initializeDirectMode}                                                 from "../modes/mode-direct";
import {initializeQuerystringMode}                                            from "../modes/mode-querystring";
import {initializeMapFilterMode}                                              from "../modes/mode-mapfilter";
import {initializeSpwParseField}                                              from "../modes/mode-spw";
import {initializeModeSelection, setDocumentMode}                             from "../modes";
import {initKeystrokes}                                                       from "./keystrokes";
import {initializeReflexMode}                                                 from "../modes/mode-reflex";
import {initializeStoryMode}                                                  from "../modes/mode-story";

export const POWER_MODE = ['common', 'dev'][0];

export function initParameters() {
  window.spwashi.parameters                        = window.spwashi.parameters || {};
  window.spwashi.parameters.debug                  = false;
  window.spwashi.parameters.perspective            = window.spwashi.parameters.perspective || undefined;
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
  window.spwashi.parameters.forces.velocityDecay   = window.spwashi.parameters.forces.velocityDecay || .91;
  window.spwashi.parameters.forces.charge          = window.spwashi.parameters.forces.charge || 10;
  window.spwashi.parameters.forces.centerStrength  = window.spwashi.parameters.forces.centerStrength || 1;
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
  window.spwashi.featuredIdentity     = /\/identity\/([a-zA-Z\d]+)/.exec(window.location.href)?.[1] || searchParameters.get('identity');
  const parameterKey                  = `spwashi.parameters#${window.spwashi.featuredIdentity}`;
  window.spwashi.parameterKey         = parameterKey;
  console.log({parameterKey});
  let mode;
  if (searchParameters.get('title')) {
    document.title                         = searchParameters.get('title');
    document.querySelector('h1').innerText = searchParameters.get('title');
  }
  if (searchParameters.has('perspective')) {
    window.spwashi.parameters.perspective = searchParameters.get('perspective') !== '0';
  }
  if (searchParameters.has('display')) {
    document.body.dataset.displaymode = searchParameters.get('display');
  }
  if (searchParameters.has('reset')) {
    window.localStorage.clear();
  }
  if (searchParameters.has('nodeCount')) {
    window.spwashi.parameters.nodes       = window.spwashi.parameters.nodes || {};
    window.spwashi.parameters.nodes.count = +searchParameters.get('nodeCount');
  }
  if (searchParameters.has('linkStrength')) {
    window.spwashi.parameters.links.strength = +searchParameters.get('linkStrength');
  }
  if (searchParameters.has('charge')) {
    window.spwashi.parameters.forces.charge = +searchParameters.get('charge');
  }
  if (searchParameters.has('linkStyle')) {
    window.spwashi.parameters.links.linkPrev = searchParameters.get('linkStyle') === 'prev';
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
  if (searchParameters.has('centerStrength')) {

  }
  if (searchParameters.has('center')) {
    let [x, y]                                 = (searchParameters.get('center').split(',').map(n => +n));
    y                                          = y || x;
    window.spwashi.parameters.startPos         = {x, y};
    window.spwashi.parameters.forces.centerPos = {x, y};
  } else {
    let [x, y]                                 = [
      window.spwashi.parameters.width,
      window.spwashi.parameters.height,
    ].map(n => n / 2);
    window.spwashi.parameters.startPos         = {x, y};
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
  if (searchParameters.has('intent')) {
    window.spwashi.superpower.intent = parseInt(searchParameters.get('intent') || 1);
  }
  if (searchParameters.has('mode')) {
    mode = searchParameters.get('mode');
    setTimeout(() => setDocumentMode(mode, false), 500)
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
  if (searchParameters.has('doFetch')) {
    window.spwashi.doFetchNodes = searchParameters.get('dofetch') === '1'
  }
  if (searchParameters.has('boundingBox')) {
    window.spwashi.parameters.forces.boundingBox = searchParameters.get('boundingBox') === '1'
  }
  if (searchParameters.has('dataindex')) {
    window.spwashi.parameters.dataIndex = +searchParameters.get('dataindex');
    setDocumentDataIndex(getDataIndexForNumber(window.spwashi.parameters.dataIndex));
  }
  if (searchParameters.has('debug')) {
    window.spwashi.parameters.debug = true;
    document.body.dataset.debug     = 'debug'
  }

  initializeDirectMode();
  initializeQuerystringMode();
  initializeMapFilterMode();
  initializeSpwParseField();
  initializeReflexMode();
  initializeStoryMode();
  initializeModeSelection(mode);
  initializeDataindexMode();
  initKeystrokes();
}