export function getNextUrlSearchParams() {
  const queryStr   = window.location.href.split('?')[1] || '';
  const params     = new URLSearchParams(queryStr);
  const nextParams = new URLSearchParams();
  params.has('title ') && nextParams.set('title', params.get('title'));
  params.has('size') && nextParams.set('size', params.get('size'));
  params.has('superpower') && nextParams.set('superpower', params.get('superpower'));
  return nextParams;
}

