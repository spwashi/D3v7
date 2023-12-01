import {reinitializeSimulation} from "../simulation/simulation";
import {CharacterCursor}        from "../../vendor/spw/core/node/cursor.mjs";
import {parse}                  from "../../vendor/spw/parser/parse.mjs";
import {getDocumentDataIndex}   from "./mode-dataindex";
import {NODE_MANAGER}           from "../simulation/nodes/nodes";
import {moreMenuOptionsSpell}   from "./mode-story";
import {initKeystrokes}         from "../init/keystrokes";
import {initFocalSquare}        from "../focalPoint";
import {setDocumentMode}        from "./index";
import {generateNodes}          from "../simulation/nodes/generateNodes";

const parseSpw = (text) => {
  const tokens    = [];
  const generator = parse(text, {asGenerator: true});
  for (let value of generator) {
    if (CharacterCursor.isCharacterCursor(value)) {
      tokens.push(value.getToken());
    }
  }

  const perspective = getDocumentDataIndex();
  const tokenObj    = {};
  tokens.forEach(token => tokenObj[token.identity] = tokenObj[token.identity] || token);
  const newIdentities = appendIdentities(perspective, Object.keys(tokenObj), tokenObj);
  return newIdentities.map(identity => tokenObj[identity]);
}

function appendIdentities(perspective, identities, tokenObj) {
  if (!window.spwashi.perspectiveMap.has(perspective)) {
    window.spwashi.perspectiveMap.set(perspective, {
      identities: new Set(),
      tokenObj:   {},
    });
  }
  const perspectiveDict = window.spwashi.perspectiveMap.get(perspective);
  const newIdentities   = identities.filter(identity => !perspectiveDict.identities.has(identity));
  newIdentities.forEach(identity => {
    perspectiveDict.identities.add(identity);
  });
  Object.assign(perspectiveDict.tokenObj, tokenObj);
  return newIdentities;
}

function getTokenObj(identities) {
  return Object.fromEntries(identities.map(identity => [identity, {identity}]));
}

function setPageImage(url) {
  window.spwashi.setItem('parameters.page-image', url);
}

function initPageImage() {
  const mainImageContainer     = document.querySelector('#main-image-container');
  mainImageContainer.innerHTML = '';
  const url                    = window.spwashi.getItem('parameters.page-image');
  if (url) {
    const img = new Image();
    img.src   = url;
    mainImageContainer.appendChild(img);
  }
}

function initInputField() {
  const value    = window.spwashi.getItem('parameters.spw-parse-field') || '';
  const spwInput = document.querySelector('#spw-parse-field');
  spwInput.value = value;
  // listen for image paste events
  spwInput.addEventListener('paste', (e) => {
    const items = (e.clipboardData || e.originalEvent.clipboardData).items;
    for (const item of items) {
      if (item.type.indexOf('image') === 0) {
        const blob = item.getAsFile();
        const url  = URL.createObjectURL(blob);
        const img  = new Image();
        img.src    = url;
        setPageImage(url);
        initPageImage();
      }
    }
  });
  return spwInput;
}

export function initializeSpwParseField() {
  initPageImage();
  window.spwashi.perspectiveMap = new Map();
  const perspective             = getDocumentDataIndex();
  const identities              = window.spwashi.nodes.map(node => node.identity);
  appendIdentities(perspective, identities, getTokenObj(identities));

  const spwInput = initInputField();

  window.spwashi.spwEditor = spwInput;
  const button             = document.querySelector('#parse-spw');
  button.onclick           = () => {
    const text   = spwInput.value;
    const parsed = parseSpw(text);
    window.spwashi.setItem('parameters.spw-parse-field', text);
    setDocumentMode('');

    let physicsChange = false;
    text.split('\n').forEach(line => {

      const add = /add=(-?\d+)/.exec(line)?.[1];
      if (add) {
        physicsChange = true;
        generateNodes(parseInt(add));
        return;
      }
      const boundingBox = /boundingBox=(-?\d+)/.exec(line)?.[1];
      if (boundingBox) {
        physicsChange                                = true;
        window.spwashi.parameters.forces.boundingBox = !!parseInt(boundingBox);
        return;
      }
      const charge = /charge=(-?\d+)/.exec(line)?.[1];
      if (charge) {
        physicsChange                           = true;
        window.spwashi.parameters.forces.charge = parseInt(charge);
        return;
      }
      const velocityDecay = /velocityDecay=(-?\d*\.?\d+)/.exec(line)?.[1];
      if (velocityDecay) {
        physicsChange                                  = true;
        window.spwashi.parameters.forces.velocityDecay = parseFloat(velocityDecay);
        return;
      }
      const nodeQueue = /nodeCount=(\d+)/.exec(line)?.[1];
      if (nodeQueue) {
        physicsChange                         = true;
        window.spwashi.parameters.nodes.count = parseInt(nodeQueue);
        return;
      }

      switch (line) {
        case 'scatter':
          window.spwashi.nodes.forEach(node => {
            node.x = Math.random() * 1000;
            node.y = Math.random() * 1000;
          });
          reinitializeSimulation();
          return;
        case 'link':
          // linking pattern of the day
          const nodes = window.spwashi.nodes;
          nodes.forEach((node, i) => {
            const source = nodes[i];
            const target = nodes[(i + 1) % nodes.length];
            window.spwashi.links.push({source, target, strength: .1});
          });
          reinitializeSimulation();
          return;
        case 'bone' :
          window.spwashi.bone();
          return;
        case 'boon':
          window.spwashi.boon();
          return;
        case 'honk' :
          window.spwashi.honk();
          return;
        case 'bonk':
          window.spwashi.bonk();
          return;
        case 'display=nodes':
          const urlParams = new URLSearchParams()
          urlParams.set('display', 'nodes');
          window.spwashi.readParameters(urlParams);
          return;
        case 'clear page image':
          window.spwashi.setItem('parameters.page-image', '');
          initPageImage();
          return;
        case 'clear':
          window.spwashi.nodes = [];
          window.spwashi.links = [];
          reinitializeSimulation();
          initFocalSquare().focus();
          return;
        case moreMenuOptionsSpell:
          window.spwashi.keystrokeRevealOrder = 1;
          initKeystrokes();
          break;
      }

    })
    physicsChange && reinitializeSimulation();

    const newNodes = JSON.parse(JSON.stringify(parsed));
    newNodes.forEach(NODE_MANAGER.processNode);
    window.spwashi.nodes.push(...newNodes);
    reinitializeSimulation();
    initFocalSquare().focus();
  }
}