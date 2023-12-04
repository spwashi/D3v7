export function setPageImage(base64) {
  const img = new Image();
  img.src   = base64;
  window.spwashi.setItem('parameters.page-image.url', base64);
  return img;
}

export function initPageImage() {
  const mainImageContainer     = document.querySelector('#main-image-container');
  mainImageContainer.innerHTML = '';
  const url                    = window.spwashi.getItem('parameters.page-image.url');
  if (url) {
    const img = new Image();
    img.src   = url;
    mainImageContainer.appendChild(img);
  }
}