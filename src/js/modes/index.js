const setDocumentMode          = mode => {
  window.spwashi.parameters.mode = mode;
  return document.body.dataset.mode = mode;
};
window.spwashi.setDocumentMode = setDocumentMode;

export function initializeModeSelection(starterMode) {
  const modeSelect = document.querySelector('#mode-selector');
  setDocumentMode(starterMode)
  modeSelect.value    = starterMode;
  modeSelect.onchange = function (e) {
    const mode = e.target.value;
    setDocumentMode(mode)
  }
}

export {getDataIndexKey} from "./mode-dataindex";