export function alphaTarget__get(searchParameters) {
  if (searchParameters.has('alphaTarget')) {
    window.spwashi.parameters.forces.alphaTarget = +searchParameters.get('alphaTarget');
  }
}