import {setDocumentMode} from "./index";

export function setDocumentDataIndex(index) {
  document.body.dataset.dataindex = index;
}

export function getDocumentDataIndex() {
  return parseInt((document.body.dataset.dataindex || '1').split('-').reverse()[0]);
}

export function initializeDataindexMode() {
  const colorContainer   = document.querySelector('#colors');
  colorContainer.onclick = function (e) {
    const target = e.target;
    const color  = target.dataset.dataindex;
    setDocumentDataIndex(color);
    setDocumentMode(null);
  }
}

const dataindexPrefix = 'spwashi-datum-';

export function getDataIndexForNumber(index) {
  return dataindexPrefix + (index % 13);
}