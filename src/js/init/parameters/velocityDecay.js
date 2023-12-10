export function velocityDecay(searchParameters) {
  if (searchParameters.has('velocityDecay')) {
    window.spwashi.parameters.forces.velocityDecay = +searchParameters.get('velocityDecay');
  }
}