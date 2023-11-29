export const getDocumentMode = () => {
  return window.spwashi.parameters.mode;
}
export const setDocumentMode = (mode, doToggle = true, direct = false) => {
  if (doToggle && getDocumentMode() === mode) mode = null;
  window.spwashi.parameters.mode = mode;
  document.body.dataset.mode     = mode;
  window.spwashi.onModeChange(mode, direct);
};

export function initializeModeSelection(starterMode) {
  const liString                 = window.spwashi.modeOrder.map((mode) => { return `<li data-mode-action="${mode}"><button id="mode-selector--${mode}">${mode}</button></li>`; }).join('');
  const quickactionShortcutsList = document.querySelector('#quickaction-shortcuts ol');

  quickactionShortcutsList.innerHTML = liString;
  window.spwashi.modeOrder.forEach((mode) => {
    const button   = document.querySelector(`#mode-selector--${mode}`);
    button.onclick = () => {
      setDocumentMode(getDocumentMode() === mode ? null : mode);

    }
  });

  setDocumentMode(starterMode)
}

export {getDataIndexForNumber} from "./mode-dataindex";