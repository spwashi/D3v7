export function fx(searchParameters) {
  if (searchParameters.has('fx')) {
    window.spwashi.values.fx = searchParameters.get('fx').split(',').map(n => +n);
  }
}