import ace                      from "ace-builds";
import {reinitializeSimulation} from "../simulation/simulation";

export function initializeSpwParseField() {
  const element  = document.querySelector('#spw-parse-field');
  const value    = window.spwashi.getItem('parameters.spw-parse-field') || '';
  const spwInput = ace.edit('spw-parse-field');
  spwInput.setOptions({useWorker: false})
  spwInput.setValue(value);
  const button   = document.querySelector('#parse-spw');
  button.onclick = () => {
    const text   = spwInput.getValue()
    const parsed = window.spwashi.parse(text);
    window.spwashi.setItem('parameters.spw-parse-field', text);
    window.spwashi.nodes.push(...JSON.parse(JSON.stringify(parsed)));
    reinitializeSimulation();
  }
}