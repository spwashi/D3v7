export function display__get(searchParameters) {
  if (searchParameters.has('display')) {
    document.body.dataset.displaymode = searchParameters.get('display');
  }
}