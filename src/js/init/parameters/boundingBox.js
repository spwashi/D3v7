export function boundingBox__get(searchParameters) {
  if (searchParameters.has('boundingBox')) {
    window.spwashi.parameters.forces.boundingBox = searchParameters.get('boundingBox') === '1'
  }
}