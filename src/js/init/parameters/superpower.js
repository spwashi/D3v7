export function superpower__get(searchParameters) {
  if (searchParameters.has('superpower')) {
    window.spwashi.superpower.name = searchParameters.get('superpower');
  }
}