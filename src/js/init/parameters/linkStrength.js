export function linkStrength__get(searchParameters) {
  if (searchParameters.has('linkStrength')) {
    window.spwashi.parameters.links.strength = +searchParameters.get('linkStrength');
  }
}