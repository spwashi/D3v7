import {processSpwInput}                           from "../modes/spw/process-spw-input";
import {setDocumentMode}                           from "../modes";
import {parse}                                     from "../../vendor/spw/parser/parse.mjs";
import {getIdentityPath}                           from "../simulation/nodes/data/process";
import md5                      from "md5";
import {processPastedText}      from "../init/hotkeys/handlers/pasted-text";
import {getNextUrlSearchParams} from "../util/next-url";

export function initH1() {
  const h1                = document.querySelector('h1');
  const currentText       = h1.innerText;
  const changeTitleButton = document.querySelector('#main-wonder-button');
  h1.tabIndex             = 0;
  h1.onclick              = (e) => {
    if (e.target !== h1) return;
    e.stopPropagation()
    fillH1()
  }
  h1.onkeydown            = (e) => {
    if (e.ctrlKey || e.metaKey) {
      if (e.key === 'c') {
        navigator.clipboard.writeText(currentText);
      }
      return;
    }
    if (e.key === 'Shift') return;
    if (e.target !== h1) return;
    if (e.key === 'Tab') return;
    if (e.key === ' ') {
      e.preventDefault()
    }
    // if key is number ignore
    if (e.key.match(/\d/)) return;
    changeTitleButton.click();
  }

  let temporaryDocumentClickHandler;

  function resetH1(focus = true) {
    document.removeEventListener('click', temporaryDocumentClickHandler);
    h1.innerText = currentText
    focus && h1.focus();
  }

  function fillH1() {
    const form    = document.createElement('form');
    const input   = document.createElement('input');
    input.onpaste = (e) => {
      e.preventDefault();
      const text = e.clipboardData.getData('text/plain');
      processPastedText(text);
    }
    input.value   = currentText;
    input.id      = 'h1-input';
    form.appendChild(input);
    const submit       = document.createElement('button');
    submit.type        = 'submit';
    submit.innerText   = 'submit';
    let doFocusH1After = true;
    form.appendChild(submit);
    h1.innerHTML = '';
    h1.appendChild(form);
    input.focus();
    input.setSelectionRange(0, input.value.length);
    submit.onclick = (e) => {
      e.preventDefault();
      const value = input.value;

      const {liveStrings, nextDocumentMode, valueStrings} = processSpwInput(value);
      if (nextDocumentMode === 'spw') {
        doFocusH1After                 = false;
        window.spwashi.spwEditor.value = (valueStrings.join('\n'));
        setDocumentMode('spw', false, true);
        return;
      }
      const processedInput = valueStrings.join('\n');
      if (!processedInput) return;
      const parsed = JSON.parse(JSON.stringify(parse(processedInput)));
      const params = getNextUrlSearchParams();

      window.location.href = getIdentityPath(
        md5(parsed.identity),
        params,
        parsed.identity
      );
    }

    temporaryDocumentClickHandler = () => { resetH1(doFocusH1After); };
    submit.onblur                 = () => { resetH1(doFocusH1After); }
    document.addEventListener('click', temporaryDocumentClickHandler)
  }

  changeTitleButton.onclick = (e) => {
    e.stopPropagation()

    fillH1();
  }
}