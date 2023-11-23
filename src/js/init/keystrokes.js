import {generateNodes}          from "../simulation/nodes/generateNodes";
import {reinitializeSimulation} from "../simulation/simulation";
import {NODE_MANAGER}           from "../simulation/nodes/nodes";
import {setDocumentMode}        from "../modes";

export function initKeystrokes() {
  window.spwashi.keystrokeOptions = [
    {shortcut: '-', categories: ['cache', 'nodes'], title: 'clear', callback: clearCachedNodes},
    {shortcut: '\\', categories: ['cache', 'local'], title: 'clear', callback: clearLocalStorage},
    {shortcut: '<space>'},
    {shortcut: 'ArrowRight', categories: ['nodes'], shortcutName: '→', title: '++charge', callback: increaseCharge},
    {shortcut: 'ArrowLeft', categories: ['nodes'], shortcutName: '←', title: '--charge', callback: decreaseCharge,},
    {shortcut: '<space>'},
    {shortcut: '.', categories: ['nodes'], title: 'freeze', callback: fixPositions},
    {shortcut: ',', categories: ['nodes'], title: 'unfreeze', callback: clearFixedPositions},
    {shortcut: '<space>'},
    {shortcut: 'ArrowDown', categories: ['nodes'], shortcutName: '↓', title: 'fewer', callback: lessNodes},
    {shortcut: 'ArrowUp', categories: ['nodes'], shortcutName: '↑', title: 'more', callback: moreNodes},
    {shortcut: '<space>'},
    {shortcut: 'c', categories: ['nodes'], title: 'copy', callback: copyNodesToClipboard},
    {shortcut: 'k', categories: ['nodes'], title: 'clear', callback: clearActiveNodes},
    {shortcut: 's', categories: ['nodes'], title: 'save', callback: saveActiveNodes},
  ]
  initKeystrokeOptions();
}

function copyNodesToClipboard() {
  const nodes = window.spwashi.nodes;
  const text  = nodes.map(n => n.id.trim() ? `<${n.id.trim()}>` : '').filter(t => t.length).join('\n');
  navigator.clipboard.writeText(text);
}

function moreNodes() {
  generateNodes();
}

function lessNodes() {
  window.spwashi.nodes.length = Math.max(0, window.spwashi.nodes.length - window.spwashi.parameters.nodes.count);
  reinitializeSimulation();
}

function decreaseCharge() {
  window.spwashi.parameters.forces.charge -= 10;
  reinitializeSimulation();
}

function increaseCharge() {
  window.spwashi.parameters.forces.charge += 10;
  reinitializeSimulation();
}

function saveActiveNodes() {
  const nodes = window.spwashi.nodes;
  nodes.map(NODE_MANAGER.cacheNode)
  window.spwashi.setItem('parameters.nodes-input', nodes);
  window.spwashi.setItem('parameters.nodes-input-map-fn-string', 'data => data');
  window.spwashi.refreshNodeInputs();
}

function clearActiveNodes() {
  window.spwashi.nodes.length = 0;
  reinitializeSimulation();
}

function fixPositions() {
  window.spwashi.nodes.forEach(node => {
    node.fx = node.x;
    node.fy = node.y;
  });
}

function clearCachedNodes() {
  window.spwashi.clearCachedNodes();
}

function clearFixedPositions() {
  window.spwashi.nodes.forEach(node => {
    node.fx = undefined;
    node.fy = undefined;
  });
}

function clearLocalStorage() {
  window.localStorage.clear();
  window.location.href = window.location.href.split('?')[0];
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Backspace') {
    window.spwashi.nodes.length = window.spwashi.nodes.length - 1;
    reinitializeSimulation();
  }

  const shortKeys = {
    1: () => setDocumentMode('spw'),
    2: () => setDocumentMode('color'),
    3: () => setDocumentMode('reflex'),
    4: () => setDocumentMode('node'),
    5: () => setDocumentMode('map'),
    6: () => setDocumentMode('filter'),
    7: () => setDocumentMode('query'),
    8: () => setDocumentMode('debug'),
    0: () => setDocumentMode(''),
  };

  if (shortKeys[e.key]) {
    e.preventDefault();
    shortKeys[e.key]();
  }
  if (e.key === ' ') {
    // generateNodes(e.shiftKey ? window.spwashi.parameters.nodes.count : 1);
  }
  if (!(e.metaKey || e.ctrlKey)) return;
  if (e.shiftKey) return;

  for (let option of window.spwashi.keystrokeOptions) {
    if (e.key === option.shortcut) {
      e.preventDefault();
      option.callback();
    }
  }
})

function initKeystrokeOptions() {
  const keystrokeOptions     = document.querySelector('#keystroke-options');
  keystrokeOptions.innerHTML = '';
  const optionList           = keystrokeOptions.appendChild(document.createElement('UL'));
  window.spwashi.keystrokeOptions.forEach(({shortcut, categories = [], title, callback, shortcutName}) => {
    const li = optionList.appendChild(document.createElement('LI'));
    if (!title) return;
    li.tabIndex  = 0;
    li.innerHTML = `<span class="${categories.join(' ')}">${categories.map(c => '[' + c + ']').join('')} ${title}</span><kbd>ctrl + <strong>${shortcutName || shortcut}</strong></kbd>`;
    li.onclick   = callback;
    li.addEventListener('keydown', e => {
      if (e.key === ' ') {
        callback();
      }
    });
  });
}

