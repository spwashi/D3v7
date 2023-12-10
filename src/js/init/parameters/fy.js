export function fy__get(searchParameters) {
  if (searchParameters.has('fy')) {
    window.spwashi.values.fy = searchParameters.get('fy').split(',').map(n => +n);
  }
}