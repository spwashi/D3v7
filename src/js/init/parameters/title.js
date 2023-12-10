export function title__get(searchParameters) {
  if (searchParameters.get('title')) {
    document.title                         = searchParameters.get('title');
    document.querySelector('h1').innerText = searchParameters.get('title');
  }
}