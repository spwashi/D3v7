export function zoom__get(searchParameters) {
  if (searchParameters.has('zoom')) {
    window.spwashi.parameters.canzoom = !!(+searchParameters.get('zoom'));
  } else {
    window.spwashi.parameters.canzoom = true;
  }
}