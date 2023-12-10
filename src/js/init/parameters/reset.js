export function reset__get(searchParameters) {
  if (searchParameters.has('reset')) {
    window.localStorage.clear();
  }
}