const images = [ 'images/01.webp', 'images/02.webp', ];
const getImageHref = d => images[(d.colorindex || 0) % (images.length)];
