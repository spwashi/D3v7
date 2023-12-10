export function alpha__get(searchParameters) {
  if (searchParameters.has('alpha')) {
    window.spwashi.parameters.forces.alpha = +searchParameters.get('alpha');
  }
}