export function width__get(searchParameters) {
  if (searchParameters.has('width')) {
    window.spwashi.parameters.width = +searchParameters.get('width');
  }
}