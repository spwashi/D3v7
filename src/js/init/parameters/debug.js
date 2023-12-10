export function debug__get(searchParameters) {
  if (searchParameters.has('debug')) {
    window.spwashi.parameters.debug = true;
    document.body.dataset.debug     = 'debug'
  }
}