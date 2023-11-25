import {cacheNode} from "./store";
import {sortNodes} from "./nodes";

export function logMainEvent(event) {
  const eventsElement = document.querySelector('#main-log ul.events-log');
  const listItem      = document.createElement('li');
  listItem.innerText  = event;
  eventsElement.appendChild(listItem);
}

export function makeCircle(g) {
  const onclick = (e, d) => {
    logMainEvent('clicked: ' + d.id);
    if (e.defaultPrevented) return;
    let weight = window.spwashi.superpower.weight;
    if (e.key === 'x') {
      d.fx = isNaN(d.fx) ? d.x : d.fx;
      return;
    }
    if (e.key === 'y') {
      d.fy = isNaN(d.fy) ? d.y : d.fy;
      return;
    }
    if (e.shiftKey) {
      d.fx = d.fy = undefined;
      return;
    }
    if (e.key && e.key !== ' ') return;

    if (e.shiftKey) {
      weight *= -1;
    }

    switch (window.spwashi.superpower.name) {
      case 'alert':
        if (!d.md5) return;
        navigator.clipboard.writeText(d.md5).then(e => {
          alert(d.md5);
        });
        break;
      case 'grow': {
        d.r += weight;
        break;
      }
      case 'shrink': {
        d.r -= weight;
        break;
      }
      case 'changecolor': {
        if (isNaN(d.colorindex)) d.colorindex = 1;
        d.colorindex += weight;
        break;
      }
      case 'z': {
        d.z = d.z || 0;
        d.z += weight;
        sortNodes(ACTIVE_NODES);
        break;
      }
    }
    cacheNode(d);
  }

  return g
    .append('circle')
    .attr('data-colorindex', d => 'spwashi-datum-' + d.colorindex)
    .attr('r', d => (d.r || 1))
    .attr('cx', d => d.x || 0)
    .attr('cy', d => d.y || 0)
    .call(
      d3
        .drag()
        .on('start', (e, node) => {
          node.x = e.x;
          node.y = e.y;
        })
        .on('drag', (e, node) => {
          node.fx = e.x;
          node.fy = e.y;
        })
        .on('end', (e, node) => {
          window.spwashi.tick();
          cacheNode(node);
        })
    )
    .on('click', onclick)
    .on('keydown', (e, d) => {
      onclick(e, d)
    });
}

export function updateCircle(update) {
  update
    .select('circle')
    .attr('data-colorindex', d => 'spwashi-datum-' + (d.colorindex % 13))
    .attr('cx', d => d.x || 0)
    .attr('r', d => (d.r || 1))
    .attr('cy', d => d.y || 0)
}
