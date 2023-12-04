import {reinitializeSimulation}      from "../../simulation/simulation";
import {initPageImage, setPageImage} from "../../ui/page-image";
import {processLine}                 from "./process-line";

export function initSpwParseField() {
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


export function processSpwInput(text) {
  const sideEffects = {
    physicsChange:    false,
    nextDocumentMode: '',

    liveStrings:  [],
    valueStrings: [],

    nodesAdded:    [],
    nodesImpacted: [],
    nodesIgnored:  [],
  }

  const nodeIdCacheObj = {};
  window.spwashi.nodes.forEach(node => {
    node.stroke = undefined;

    nodeIdCacheObj[node.id] = node;
  });
  const textLines = text.split('\n');

  textLines.map(line => {
    if (nodeIdCacheObj[line]) {
      sideEffects.nodesIgnored.push(nodeIdCacheObj[line]);
      return;
    }
    processLine(line, sideEffects);
  });

  sideEffects.nodesAdded.forEach(node => { node.stroke = 'red'; });
  sideEffects.nodesIgnored.forEach(node => { node.r = 10; });
  sideEffects.nodesImpacted.forEach(node => { node.r = 100; });

  if (sideEffects.physicsChange) {
    reinitializeSimulation();
  }

  return {
    nextDocumentMode: sideEffects.nextDocumentMode,
    liveStrings:      sideEffects.liveStrings,
    valueStrings:     sideEffects.valueStrings,
  };
}