export function defaultRadius__get(searchParameters) {
  if (searchParameters.has('defaultRadius')) {
    window.spwashi.parameters.nodes.radiusMultiplier = +searchParameters.get('defaultRadius');
  }
}