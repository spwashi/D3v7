export function height__get(searchParameters) {
  if (searchParameters.has('height')) {
    window.spwashi.parameters.height = +searchParameters.get('height');
  }
}