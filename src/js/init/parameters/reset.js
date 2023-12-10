export function reset(searchParameters) {
  if (searchParameters.has('reset')) {
    window.localStorage.clear();
  }
}