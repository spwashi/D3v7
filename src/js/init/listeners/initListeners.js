import {initDocumentMousedown}                                                         from "./initDocumentMousedown";
import {attachFocalPointToElementPosition, focalPoint, initFocalSquare, setFocalPoint} from "../../ui/focal-point";
import {onReflexModeStart}                                                             from "../../modes/reflex/mode-reflex";
import {onColorModeStart}                                                              from "../../modes/dataindex/mode-dataindex";

function resetArrows() {
  const noop                          = () => {};
  window.spwashi.callbacks.arrowUp    = noop;
  window.spwashi.callbacks.arrowDown  = noop;
  window.spwashi.callbacks.arrowLeft  = noop;
  window.spwashi.callbacks.arrowRight = noop;
}

function resetInterfaceDepth() {
  document.body.dataset.interfaceDepth = 'standard'
}

export function initListeners() {
  initDocumentMousedown();

  window.spwashi.onModeChange      = (mode, direct = false) => {
    if (mode) {
      window.spwashi.setItem('mode', mode, 'focal.root');
    }
    document.querySelector('[data-mode-action] [aria-selected="true"]')?.setAttribute('aria-selected', 'false');
    const button = document.querySelector(`#mode-selector--${mode}`);
    if (button) {
      button.setAttribute('aria-selected', 'true');
      initFocalSquare();
      if (document.body.dataset.interfaceDepth === 'main-menu') {
        attachFocalPointToElementPosition(button);
      } else {
        if (!focalPoint.fx) {
          setFocalPoint({
                          x: window.innerWidth * 0.2,
                          y: window.innerHeight * 0.75,
                        });
        }
      }
    }
    resetArrows();
    switch (mode) {
      case 'spw':
        const spwModeContainer    = document.querySelector('#spw-mode-container');
        spwModeContainer.tabIndex = 0;
        direct && spwModeContainer.focus();
        break;
      case 'reflex':
        onReflexModeStart();
        break;
      case 'color':
        onColorModeStart()
        break;
      case 'story':
        const storyModeContainer = document.querySelector('#story-mode-container');
        const buttonContainer    = storyModeContainer.querySelector('.button-container button');
        buttonContainer.focus();
        buttonContainer.onfocus = () => buttonContainer.tabIndex = 0;
        break;
      case 'node':
        const nodeInputContainer    = document.querySelector('#node-input-container');
        nodeInputContainer.tabIndex = 0;
        nodeInputContainer.focus();
        nodeInputContainer.onfocus = () => nodeInputContainer.tabIndex = 0;
        break;
      case 'map':
        window.spwashi.callbacks.onMapMode?.();
        break;
      case 'filter':
        window.spwashi.callbacks.onFilterMode?.();
        break;
    }
    resetInterfaceDepth();
  }
  window.spwashi.onDataIndexChange = (dataindex) => {
  };
}