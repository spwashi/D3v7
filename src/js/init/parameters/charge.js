export function charge__get(searchParameters) {
  if (searchParameters.has('charge')) {
    window.spwashi.parameters.forces.charge = +searchParameters.get('charge');
  }
}