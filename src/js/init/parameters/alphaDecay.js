export function alphaDecay__get(searchParameters) {
  if (searchParameters.has('alphaDecay')) {
    window.spwashi.parameters.forces.alphaDecay = +searchParameters.get('alphaDecay');
  }
}