import {setDocumentMode} from "./modes";

let focalPointElement;

const focalPointMeta = {
  ready: true,
};

export const focalPoint =
               {
                 x:            0,
                 y:            0,
                 queuedAction: () => {
                   const mode = window.spwashi.getItem('mode');
                   setDocumentMode(mode);
                 },
                 onFocus:      () => {}
               };

export function initFocalSquare() {
  if (!focalPointElement) {
    focalPointElement    = document.createElement('button');
    const prevFocalPoint = window.spwashi.getItem('focalPoint');
    if (prevFocalPoint) {
      Object.assign(focalPoint, prevFocalPoint);
      setFocalPoint(focalPoint, true);
    }
    focalPointElement.id = 'focal-square';
    focalPointElement.classList.add('focal-square');
    focalPointElement.onmousedown  = (e) => {
      e.preventDefault();
      focalPointElement.classList.add('dragging');
      document.documentElement.onmousemove = (e) => {
        e.preventDefault();
        focalPointMeta.ready = false;
        setFocalPoint({x: e.x, y: e.y}, true);
      }
      document.documentElement.onmouseup   = (e) => {
        e.preventDefault();
        focalPointElement.classList.remove('dragging');
        if (!focalPointMeta.ready) {
          setTimeout(() => focalPointMeta.ready = true, 100);
        }
        document.documentElement.onmousemove = null;
        document.documentElement.onmouseup   = null;
      }
    }
    focalPointElement.ontouchstart = (e) => {
      e.preventDefault();
      focalPointElement.classList.add('dragging');
      document.documentElement.ontouchmove = (e) => {
        e.preventDefault();
        focalPointMeta.ready = false;
        setFocalPoint({x: e.touches[0].clientX, y: e.touches[0].clientY}, true);
      }
      document.documentElement.ontouchend  = (e) => {
        e.preventDefault();
        focalPointElement.classList.remove('dragging');
        if (!focalPointMeta.ready) {
          setTimeout(() => focalPointMeta.ready = true, 100);
        }
        document.documentElement.ontouchmove = null;
        document.documentElement.ontouchend  = null;
      }
    }
    document.documentElement.appendChild(focalPointElement);
  }
  focalPointElement.onclick = (e) => {
    if (!focalPointMeta.ready) return;
    focalPoint.queuedAction();
  }
  focalPointElement.onfocus = (e) => {
    focalPoint.onFocus();
  }
  return focalPointElement;
}

export function setFocalPoint({x, y}, fix = false) {
  focalPoint.x = x;
  focalPoint.y = y;
  if (fix) {
    focalPoint.fx = x;
    focalPoint.fy = y;
  }
  document.documentElement.style.setProperty('--focal-x', x + 'px');
  document.documentElement.style.setProperty('--focal-y', y + 'px');
  window.spwashi.setItem('focalPoint', {x, y, fx: x, fy: y});
}

export function attachFocalPointToElementPosition(button) {
  const x        = button.getBoundingClientRect().x;
  const y        = button.getBoundingClientRect().y;
  const w        = button.getBoundingClientRect().width;
  const h        = button.getBoundingClientRect().height;
  const focalX   = x + w;
  const focalY   = y + h;
  const notFixed = focalPoint.fx === undefined || focalPoint.fy === undefined;
  notFixed && setFocalPoint({x: focalX, y: focalY});
}