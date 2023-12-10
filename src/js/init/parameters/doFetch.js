export function doFetch__get(searchParameters) {
  if (searchParameters.has('doFetch')) {
    window.spwashi.doFetchNodes = searchParameters.get('dofetch') === '1'
  }
}