export function r__get(searchParameters) {
  if (searchParameters.has('r')) {
    window.spwashi.values.r = searchParameters.get('r').split(',').map(n => +n);
  }
}