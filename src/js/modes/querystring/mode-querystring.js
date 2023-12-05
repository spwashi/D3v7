import {readParameters} from "../../init/parameters";

export function initializeQuerystringMode() {
  const element     = document.querySelector('#query-parameters .value');
  const text        = [...new URLSearchParams(window.location.search)].map(entry => entry.join('=')).join('\n');
  element.innerHTML = text;
  element.rows      = text.split('\n').length + 1;
  const button      = document.querySelector('#query-parameters button.go');
  button.onclick    = (e) => {
    const searchParams = new URLSearchParams(element.value.split('\n').map(line => line.split('=')))
    readParameters(searchParams);
    if (e.shiftKey) {
      window.location = '?' + searchParams;
    }
  }
}