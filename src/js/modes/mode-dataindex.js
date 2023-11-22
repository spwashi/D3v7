export function setColorIndex(index) {
  document.body.dataset.dataindex = index;
}

export function getColorIndex() {
  return parseInt((document.body.dataset.dataindex || '1').split('-').reverse()[0]);
}

export function initializeColors() {
  const colorContainer   = document.querySelector('#colors');
  colorContainer.onclick = function (e) {
    const target = e.target;
    const color  = target.dataset.dataindex;
    setColorIndex(color);
  }
}

export function getDataIndexKey(index) {
  return 'spwashi-datum-' + index;
}