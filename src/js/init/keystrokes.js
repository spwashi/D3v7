import {generateNodes}          from "../simulation/nodes/generateNodes";
import {reinitializeSimulation} from "../simulation/simulation";
import {NODE_MANAGER}           from "../simulation/nodes/nodes";
import {setDocumentMode}        from "../modes";

function toggleHotkeyMenu() {
  const checkbox = document.querySelector('#hotkey-menu-toggle');
  checkbox.checked = !checkbox.checked;
  document.querySelector('#keystroke-options li').focus()
}

export function initKeystrokes() {
  window.spwashi.keystrokeOptions = [
    {shortcut: 'ArrowRight', categories: ['nodes'], shortcutName: '→', title: '++charge', callback: increaseCharge},
    {shortcut: 'ArrowLeft', categories: ['nodes'], shortcutName: '←', title: '--charge', callback: decreaseCharge,},
    {shortcut: '<space>'},
    {shortcut: '.', categories: ['nodes'], title: 'fix position', callback: fixPositions},
    {shortcut: ',', categories: ['nodes'], title: 'unfix position', callback: clearFixedPositions},
    {shortcut: '<space>'},
    {shortcut: '-', categories: ['nodes'], title: 'clear cache', callback: clearCachedNodes},
    {shortcut: 'c', categories: ['nodes'], title: 'copy', callback: copyNodesToClipboard},
    {shortcut: 'k', categories: ['nodes'], title: 'clear', callback: clearActiveNodes},
    {shortcut: 's', categories: ['nodes'], title: 'save', callback: saveActiveNodes},
    {shortcut: '<space>'},
    {shortcut: 'ArrowDown', categories: ['nodes'], shortcutName: '↓', title: 'fewer', callback: lessNodes},
    {shortcut: 'ArrowUp', categories: ['nodes'], shortcutName: '↑', title: 'more', callback: moreNodes},
    {shortcut: '<space>'},
    {shortcut: '/', categories: ['this'], title: 'toggle hotkey menu', callback: toggleHotkeyMenu},
    {shortcut: '\\', categories: ['this'], title: 'clear storage', callback: clearLocalStorage},
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
  window.spwashi.links.length = 0;
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

function plainKeyHandler(key) {
  const shortKeys = {
    1: () => setDocumentMode('reflex'),
    2: () => setDocumentMode('color'),
    3: () => setDocumentMode('spw'),
    4: () => setDocumentMode('map'),
    5: () => setDocumentMode('filter'),
    6: () => setDocumentMode('node'),
    7: () => setDocumentMode('query'),
    8: () => setDocumentMode('debug'),
    0: () => setDocumentMode(''),
  };
  if (shortKeys[key]) {
    shortKeys[key]();
    return;
  }
  if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
  if (key === ' ') {
    // generateNodes(e.shiftKey ? window.spwashi.parameters.nodes.count : 1);
  }
  if (key === 'Backspace') {
    // window.spwashi.nodes.length = window.spwashi.nodes.length - 1;
    // reinitializeSimulation();
  }
  switch (key) {
    case 'ArrowRight':
      window.spwashi.callbacks.arrowRight();
      break;
    case 'ArrowLeft':
      window.spwashi.callbacks.arrowLeft();
      break;
    case 'ArrowUp':
      window.spwashi.callbacks.arrowUp();
      break;
    case 'ArrowDown':
      window.spwashi.callbacks.arrowDown();
      break;
  }
}

document.addEventListener('keydown', (e) => {
  const key = e.key;
  if (key === 'Escape') {
    const el = document.querySelector('#mode-container :is(:focus)');
    setDocumentMode('');
  }

  if (e.shiftKey) return;

  if (e.metaKey || e.ctrlKey) {
    for (let option of window.spwashi.keystrokeOptions) {
      if (key === option.shortcut) {
        e.preventDefault();
        option.callback();
      }
    }
    return;
  }

  plainKeyHandler(key);
})

function initKeystrokeOptions() {
  const keystrokeOptions     = document.querySelector('#keystroke-options');
  keystrokeOptions.innerHTML = '';
  const optionList           = keystrokeOptions.appendChild(document.createElement('UL'));
  window.spwashi.keystrokeOptions.forEach(({shortcut, categories = [], title, callback, shortcutName}) => {
    const handler = () => {
      callback();
      document.querySelector('#show-keystroke-options input').checked = false;
    };
    const li      = optionList.appendChild(document.createElement('LI'));
    if (!title) return;
    li.tabIndex  = 0;
    li.innerHTML = `<span class="${categories.join(' ')}">${categories.map(c => '[' + c + ']').join('')} ${title}</span><kbd>ctrl + <strong>${shortcutName || shortcut}</strong></kbd>`;
    li.onclick   = handler;
    li.addEventListener('keydown', e => {
      if (e.key === ' ') {
        handler();
      }
    });
  });
}

