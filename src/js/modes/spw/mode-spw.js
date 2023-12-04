import {reinitializeSimulation}                         from "../../simulation/simulation";
import {CharacterCursor}                                from "../../../vendor/spw/core/node/cursor.mjs";
import {parse}                from "../../../vendor/spw/parser/parse.mjs";
import {getDocumentDataIndex} from "../dataindex/mode-dataindex";
import {NODE_MANAGER}    from "../../simulation/nodes/nodes";
import {initFocalSquare} from "../../ui/focal-point";
import {setDocumentMode} from "../index";
import {initSpwParseField, processSpwInput} from "./process-spw-input";
import {initPageImage}                      from "../../ui/page-image";

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
  initPageImage();
  window.spwashi.perspectiveMap = new Map();
  const perspective             = getDocumentDataIndex();
  const identities              = window.spwashi.nodes.map(node => node.identity);
  appendIdentities(perspective, identities, getTokenObj(identities));

  const spwInput = initSpwParseField();

  window.spwashi.spwEditor = spwInput;
  const button             = document.querySelector('#parse-spw');
  button.onclick           = () => {
    const {nextDocumentMode, liveStrings, valueStrings} = processSpwInput(spwInput.value);
    setDocumentMode(nextDocumentMode, false);
    spwInput.value    = valueStrings.join('\n');
    const textToParse = liveStrings.filter(l => typeof l === 'string').join('\n');
    window.spwashi.setItem('parameters.spw-parse-field', textToParse);
    const parsed   = parseSpw(textToParse);
    const newNodes = JSON.parse(JSON.stringify(parsed));
    newNodes.forEach(NODE_MANAGER.processNode);
    window.spwashi.nodes.push(...newNodes);
    reinitializeSimulation();
    initFocalSquare().focus();
  }
}