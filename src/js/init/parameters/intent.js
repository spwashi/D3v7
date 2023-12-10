export function intent__get(searchParameters) {
  if (searchParameters.has('intent')) {
    window.spwashi.superpower.intent = parseInt(searchParameters.get('intent') || 1);
  }
}