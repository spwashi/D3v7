export function doFetch(searchParameters) {
  if (searchParameters.has('doFetch')) {
    window.spwashi.doFetchNodes = searchParameters.get('dofetch') === '1'
  }
}