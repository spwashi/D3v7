export function alphaTarget(searchParameters) {
  if (searchParameters.has('alphaTarget')) {
    window.spwashi.parameters.forces.alphaTarget = +searchParameters.get('alphaTarget');
  }
}