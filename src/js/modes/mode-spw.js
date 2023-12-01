import {reinitializeSimulation} from "../simulation/simulation";
import {CharacterCursor}        from "../../vendor/spw/core/node/cursor.mjs";
import {parse}                  from "../../vendor/spw/parser/parse.mjs";
import {setDocumentMode}        from "./index";
import {getDocumentDataIndex}   from "./mode-dataindex";
import {NODE_MANAGER}           from "../simulation/nodes/nodes";
import {moreMenuOptionsSpell}   from "./mode-story";
import {initKeystrokes}         from "../init/keystrokes";
import {initFocalSquare}        from "../focalPoint";

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

export function initializeSpwParseField() {
  window.spwashi.perspectiveMap = new Map();
  const perspective             = getDocumentDataIndex();
  const identities              = window.spwashi.nodes.map(node => node.identity);
  appendIdentities(perspective, identities, getTokenObj(identities));

  const value    = window.spwashi.getItem('parameters.spw-parse-field') || '';
  const spwInput = document.querySelector('#spw-parse-field');
  spwInput.value = value;

  window.spwashi.spwEditor = spwInput;
  const button             = document.querySelector('#parse-spw');
  button.onclick           = () => {
    const text = spwInput.value;
    if (text === moreMenuOptionsSpell) {
      window.spwashi.keystrokeRevealOrder = 1;
      initKeystrokes();
    }
    const parsed = parseSpw(text);
    window.spwashi.setItem('parameters.spw-parse-field', text);
    const newNodes = JSON.parse(JSON.stringify(parsed));
    newNodes.forEach(NODE_MANAGER.processNode);
    window.spwashi.nodes.push(...newNodes);
    reinitializeSimulation();
    initFocalSquare().focus();
  }
}