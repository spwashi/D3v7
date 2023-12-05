export function getNodeImageHref(d) {
  return null;
  if (d.image.href === null) return null;
  return d.image.href || window.spwashi.images[(d.colorindex || 0) % (window.spwashi.images.length)];
}