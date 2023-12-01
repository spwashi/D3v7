import {reinitializeSimulation}                                       from "../simulation/simulation";
import {CharacterCursor}                                              from "../../vendor/spw/core/node/cursor.mjs";
import {parse}                                                        from "../../vendor/spw/parser/parse.mjs";
import {getDocumentDataIndex}                                         from "./mode-dataindex";
import {NODE_MANAGER}                                                 from "../simulation/nodes/nodes";
import {moreMenuOptionsSpell}                                         from "./mode-story";
import {initKeystrokes, saveActiveNodes, toggleInterfaceDepthOptions} from "../init/keystrokes";
import {initFocalSquare}                                              from "../focalPoint";
import {setDocumentMode}                                              from "./index";
import {generateNodes}                                                from "../simulation/nodes/generateNodes";

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

function setPageImage(base64) {
  const img = new Image();
  img.src   = base64;
  window.spwashi.setItem('parameters.page-image.url', base64);
  return img;
}

function initPageImage(img) {
  const mainImageContainer     = document.querySelector('#main-image-container');
  mainImageContainer.innerHTML = '';
  const url                    = window.spwashi.getItem('parameters.page-image.url');
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
        const blob     = item.getAsFile();
        var fileReader = new FileReader();

        fileReader.onload = function (fileLoadedEvent) {
          const srcData = fileLoadedEvent.target.result; // <--- data: base64
          const img     = setPageImage(srcData);
        };
        fileReader.readAsDataURL(blob);
        initPageImage();
      }
    }
  });
  return spwInput;
}

function filterNodeIdLines(text) {
  window.spwashi.nodes.forEach(node => {
    text = text.replace(new RegExp(node.id + '\n', 'g'));
  })
  console.log(text)
  return text;
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
    let text             = spwInput.value;
    let physicsChange    = false;
    let nextDocumentMode = '';
    let nodesImpacted    = [];
    let nodesIgnored     = [];

    let nodeIdCacheObj = {};
    window.spwashi.nodes.forEach(node => {
      nodeIdCacheObj[node.id] = node;
    });
    const parserLines = [];
    const nextValue   = [];
    const textLines   = text.split('\n');
    textLines.map(line => {
      if (nodeIdCacheObj[line]) {
        nodesIgnored.push(nodeIdCacheObj[line]);
        return;
      }
      const at = /@=(.+)/.exec(line)?.[1];
      if (at) {
        const identities = at.split(',');
        identities.map(id => {
          const node = window.spwashi.nodes.find(node => node.id === id || node.identity === id);
          node && nodesImpacted.push(node);
        })
        reinitializeSimulation();
        return;
      }
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
        case 'home':
          window.location.href = '/'
          return;
        case 'demo':
          nextValue.push('add=10');
          nextValue.push('bonk');
          nextValue.push('boundingBox=1');
          nextValue.push('charge=-100');
          nextValue.push('velocityDecay=0.9');
          nextValue.push('nodeCount=1');
          nextValue.push('boon');
          nextValue.push('bonk');
          nextValue.push('nodeCount=3');
          nextValue.push('boon');
          nextValue.push('bonk');
          nextValue.push('minimalism');
          nextDocumentMode = 'spw';
          return;
        case 'clicked':
          const clicked = window.spwashi.nodes.clicked.map(node => node.id).join('\n');
          nextValue.push(clicked);
          nextDocumentMode = 'spw';
          return;
        case 'save':
          saveActiveNodes();
          return;
        case 'cluster':
          const nodeGroups = window.spwashi.nodes.reduce((acc, node) => {
            const cluster = node.colorindex;
            acc[cluster]  = acc[cluster] || [];
            acc[cluster].push(node);
            return acc;
          }, {});

          window.spwashi.nodes = window.spwashi.nodes.filter(node => node.kind !== '__cluster');
          window.spwashi.links = window.spwashi.links.filter(link => link.source.kind !== '__cluster' && link.target.kind !== '__cluster');

          Object.entries(nodeGroups)
                .forEach(([cluster, nodes]) => {
                  const clusterNode = {
                    id:   cluster,
                    kind: '__cluster',
                    r:    100,
                  };
                  window.spwashi.nodes.push(clusterNode);
                  // add links
                  nodes.forEach(node => {
                    window.spwashi.links.push({source: clusterNode, target: node, strength: 1});
                  });
                });
          reinitializeSimulation();
          return;
        case 'minimalism':
          window.spwashi.minimalism = true;
          toggleInterfaceDepthOptions();
          document.body.dataset.displaymode = 'nodes';
          return;
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
        default:
          nextValue.push(line)
      }
      parserLines.push(line);
    });
    nodesIgnored.forEach(node => { node.r = 10; });
    nodesImpacted.forEach(node => { node.r = 100; });
    physicsChange && reinitializeSimulation();
    window.spwashi.setItem('parameters.spw-parse-field', text);
    setDocumentMode(nextDocumentMode, false);
    text           = parserLines.filter(l => typeof l === 'string').join('\n');
    text           = filterNodeIdLines(text);
    spwInput.value = nextValue.join('\n');
    const parsed   = parseSpw(text);
    const newNodes = JSON.parse(JSON.stringify(parsed));
    newNodes.forEach(NODE_MANAGER.processNode);
    window.spwashi.nodes.push(...newNodes);
    reinitializeSimulation();
    initFocalSquare().focus();
  }
}