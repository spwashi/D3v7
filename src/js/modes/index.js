export const getDocumentMode = () => {
  return window.spwashi.parameters.mode;
}
export const setDocumentMode = mode => {
  window.spwashi.parameters.mode = mode;
  document.body.dataset.mode     = mode;
  const modeSelect               = document.querySelector('#mode-selector');
  modeSelect.value               = mode || '';
  if (mode === 'spw' && window.spwashi.spwEditor) {
    window.spwashi.spwEditor.focus();
  }
};

export function initializeModeSelection(starterMode) {
  const modeSelect  = document.querySelector('#mode-selector');
  const optionsList = [
    'unset',
    'spw',
    'color',
    'reflex',
    'node',
    'map',
    'filter',
    'query',
    'debug'
  ];

  const optionsString    = optionsList.map((mode) => `<option value="${mode}">${mode}</option>`).join('');
  const liString         = optionsList.map((mode) => { return `<li data-mode-action="${mode }"><button id="mode-selector--${mode}">${mode}</button></li>`; }).join('');
  const modeSelector     = document.querySelector('#mode-selector');
  modeSelector.innerHTML = optionsString;
  const quickactionShortcutsList     = document.querySelector('#quickaction-shortcuts ul');

  quickactionShortcutsList.innerHTML = liString;
  optionsList.forEach((mode) => {
    const button = document.querySelector(`#mode-selector--${mode}`);
    button.onclick = () => {
      setDocumentMode(getDocumentMode() === mode ? null : mode)
    }
  });

  setDocumentMode(starterMode)
  modeSelect.value    = starterMode;
  modeSelect.onchange = function (e) {
    const mode = e.target.value;
    setDocumentMode(mode)
  }
}

export {getDataIndexKey} from "./mode-dataindex";