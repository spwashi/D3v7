export function superpower(searchParameters) {
  if (searchParameters.has('superpower')) {
    window.spwashi.superpower.name = searchParameters.get('superpower');
  }
}