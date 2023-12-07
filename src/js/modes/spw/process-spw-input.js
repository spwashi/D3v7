import {initPageImage, setPageImage} from "../../ui/page-image";
import {processLine}                 from "./process-line";
import {processNode}                 from "../../simulation/nodes/data/process";
import {NODE_MANAGER}                from "../../simulation/nodes/nodes";
import {forEachNode} from "../../simulation/nodes/data/operate";

export function initSpwParseField() {
  const value    = window.spwashi.getItem('parameters.spw-parse-field') || '';
  const spwInput = document.querySelector('#spw-parse-field');
  if (!spwInput){
    window.spwashi.callbacks.acknowledgeLonging('wondering about spw input')
    return;
  }
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
  forEachNode(node => {
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

  sideEffects.nodesAdded.forEach(node => {
    node.stroke = 'red';
    NODE_MANAGER.normalize(node);
    processNode(node);
  });
  sideEffects.nodesIgnored.forEach(node => { node.r = 10; });
  sideEffects.nodesImpacted.forEach(node => {
    // dark wheat
    node.stroke      = 'rgb(222,184,135)';
    node.strokeWidth = 5;
  });

  if (sideEffects.physicsChange) {
   window.spwashi.reinit();
  }

  return {
    nextDocumentMode: sideEffects.nextDocumentMode,
    liveStrings:      sideEffects.liveStrings,
    valueStrings:     sideEffects.valueStrings,
  };
}