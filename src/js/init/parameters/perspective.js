export function perspective__get(searchParameters) {
  if (searchParameters.has('perspective')) {
    window.spwashi.parameters.perspective = searchParameters.get('perspective') !== '0';
  }
}