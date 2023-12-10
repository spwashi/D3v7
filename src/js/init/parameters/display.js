export function display(searchParameters) {
  if (searchParameters.has('display')) {
    document.body.dataset.displaymode = searchParameters.get('display');
  }
}