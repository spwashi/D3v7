import {generateNodes}                  from "../../simulation/nodes/data/generate";
import {reinitializeSimulation}         from "../../simulation/simulation";
import {NODE_MANAGER}                   from "../../simulation/nodes/nodes";
import {setDocumentMode}                from "../../modes";
import {getDocumentDataIndex}           from "../../modes/dataindex/mode-dataindex";
import {convertRawInput, duplicateNode} from "../../modes/direct/mode-direct";
import {EDGE_MANAGER}                   from "../../simulation/edges/edges";
import {removeAllNodes, removeNodes}    from "../../simulation/nodes/data/set";
import {forEachNode, pushNodes}         from "../../simulation/nodes/data/operate";
import {getAllNodes}                    from "../../simulation/nodes/data/select";

const MAIN_MENU_OPTION  = 'main-menu';
const HOTKEY_OPTION     = 'hotkey-menu';
const STANDARD_OPTION   = 'standard';
const MINIMALISM_OPTION = 'minimalism';

function toggleHotkeyMenu() {
  toggleInterfaceDepthOptions([
                                HOTKEY_OPTION,
                                !window.spwashi.minimalism ? STANDARD_OPTION : MINIMALISM_OPTION
                              ]);
}

export function toggleInterfaceDepthOptions(options) {
  let nextOption;
  if (options) {
    const currentOption = options.indexOf(document.body.dataset.interfaceDepth);
    const otherOptions  = options.filter((_, i) => i !== currentOption);
    nextOption          = otherOptions[currentOption + 1] || otherOptions[0];
  } else {
    if (window.spwashi.minimalism) {
      nextOption = MINIMALISM_OPTION;
    } else {
      nextOption = STANDARD_OPTION;
    }
  }

  document.body.dataset.interfaceDepth = nextOption;
}

export function initKeystrokes() {
  const mainMenuToggle = document.querySelector('#mainmenu-toggle');
  if (mainMenuToggle) {
    mainMenuToggle.onclick = () => toggleInterfaceDepthOptions(
      [
        MAIN_MENU_OPTION,
        !window.spwashi.minimalism ? STANDARD_OPTION : MINIMALISM_OPTION
      ]
    );
  }

  window.spwashi.keystrokeRevealOrder = window.spwashi.keystrokeRevealOrder || 0;
  window.spwashi.keystrokeOptions     = window.spwashi.keystrokeOptions || initialKeyStrokeOptions;
  initHotkeyButtons();
}

function moreNodes() {
  generateNodes();
}

function bonkVelocityDecay() {
  window.spwashi.parameters.forces.velocityDecay = window.spwashi.parameters.forces.velocityDecay === 0.1 ? 0.9 : 0.1;
  reinitializeSimulation();
}

function lessNodes() {
  const amountToRemove = window.spwashi.parameters.nodes.count;
  removeNodes(amountToRemove);
  reinitializeSimulation();
}

export function saveActiveNodes() {
  const nodes = getAllNodes();
  forEachNode(NODE_MANAGER.cacheNode)
  window.spwashi.setItem('parameters.nodes-input', nodes);
  window.spwashi.setItem('parameters.nodes-input-map-fn-string', 'data => data');
  window.spwashi.refreshNodeInputs();
}

export function clearActiveNodes() {
  removeAllNodes();
  window.spwashi.links.length = 0;
  window.spwashi.perspectiveMap.delete(getDocumentDataIndex())
  reinitializeSimulation();
}

function fixPositions() {
  forEachNode(node => {
    node.fx = node.x;
    node.fy = node.y;
  });
}

function clearCachedNodes() {
  window.spwashi.clearCachedNodes();
}

function clearFixedPositions() {
  forEachNode(node => {
    node.fx = undefined;
    node.fy = undefined;
  });
}

export function getNextUrlSearchParams() {
  const queryStr   = window.location.href.split('?')[1] || '';
  const params     = new URLSearchParams(queryStr);
  const nextParams = new URLSearchParams();
  params.has('title ') && nextParams.set('title', params.get('title'));
  params.has('size') && nextParams.set('size', params.get('size'));
  params.has('superpower') && nextParams.set('superpower', params.get('superpower'));
  return nextParams;
}

function getNextHref(nextParams) {
  const href = window.location.href.split('?')[0];
  return `${href}?${nextParams.toString()}`;
}

function resetInterface() {
  window.localStorage.clear();
  const nextParams     = getNextUrlSearchParams();
  window.location.href = getNextHref(nextParams);
}

function plainKeyHandler(key, e) {
  const shortKeyEntries = window.spwashi.modeOrder.map((reflex, i) => [i + 1, () => setDocumentMode(reflex, true, true)]);
  const shortKeys       = Object.fromEntries(shortKeyEntries);

  if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
  if (key === '/') {
    e.preventDefault();
    const h1 = document.querySelector('h1');
    h1.click();
    return;
  }
  if (shortKeys[key]) {
    e && e.preventDefault();
    shortKeys[key]();
    return;
  }
  if (key === ' ') {
    // generateNodes(e.shiftKey ? window.spwashi.parameters.nodes.count : 1);
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

export function processPastedText(clipboardText) {
  const data = convertRawInput(clipboardText);
  if (data.nodes.length === 0) {
    return false;
  }
  const nodes = data.nodes.filter(NODE_MANAGER.filterNode);
  nodes.forEach(NODE_MANAGER.processNode);
  pushNodes(...nodes);
  const edges = EDGE_MANAGER.initLinks(data.links, nodes);
  window.spwashi.links.push(...edges);
  reinitializeSimulation();
}

document.addEventListener('paste', (e) => {
  if (e.target.tagName === 'INPUT') return;
  if (e.target.tagName === 'TEXTAREA') return;
  const clipboardData = e.clipboardData || window.clipboardData;
  const clipboardText = clipboardData.getData('Text');
  return processPastedText(clipboardText);
});
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

  plainKeyHandler(key, e);
})

function initHotkeyButtons() {
  const keystrokeOptions     = document.querySelector('#keystroke-options');
  keystrokeOptions.innerHTML = '';
  const hotkeyMenuToggle     = document.querySelector('#hotkey-menu-toggle');
  hotkeyMenuToggle.onclick   = e => {
    toggleHotkeyMenu();
  }
  const optionList           = keystrokeOptions.appendChild(document.createElement('UL'));
  window.spwashi.keystrokeOptions
        .filter(option => option.revealOrder <= window.spwashi.keystrokeRevealOrder)
        .forEach(({shortcut, categories = [], title, callback, shortcutName}) => {
          const handler = () => {
            callback();
          };
          const li      = optionList.appendChild(document.createElement('LI'));
          if (!title) return;
          const ctg        = li.appendChild(document.createElement('SPAN'));
          ctg.className    = 'ctg';
          ctg.innerHTML    = categories.map(c => `<span>[${c}]</span>`).join('');
          const button     = li.appendChild(document.createElement('BUTTON'));
          button.onclick   = handler;
          button.innerHTML = title;
          const kbd        = li.appendChild(document.createElement('KBD'));
          kbd.innerHTML    = `ctrl + <strong>${shortcutName || shortcut}</strong>`;
        });
}

;
const toggleFocalPoint = () => {
  const button               = document.querySelector('#focal-square');
  const wasInactive          = button.dataset.focalStatus !== 'active';
  const nextStatus           = !wasInactive ? 'inactive' : 'active';
  button.disabled            = nextStatus === 'inactive';
  button.dataset.focalStatus = nextStatus;
};

function toggleMainMenu() {
  toggleInterfaceDepthOptions([
                                MAIN_MENU_OPTION,
                                !window.spwashi.minimalism ? STANDARD_OPTION : MINIMALISM_OPTION
                              ]);
}


const initialKeyStrokeOptions = [
  {revealOrder: 0, shortcut: 'ArrowUp', categories: ['nodes'], shortcutName: '↑', title: 'more', callback: moreNodes},
  {revealOrder: 0, shortcut: '[', categories: ['this'], title: 'toggle main menu', callback: () => { toggleMainMenu(); }},
  {revealOrder: 0, shortcut: ']', categories: ['this'], title: 'toggle focal point', callback: toggleFocalPoint},
  {revealOrder: 0, shortcut: '/', categories: ['this'], title: 'toggle hotkey menu', callback: () => toggleHotkeyMenu()},
  {
    revealOrder: 0, shortcut: 'y', categories: ['this'], title: 'yoink', callback: () => {
      const nodes = getAllNodes();
      const links = window.spwashi.links;
      // unfix all nodes
      nodes.forEach(node => {
        node.fx = undefined;
        node.fy = undefined;
      });
      // remove all forces
      window.spwashi.simulation.force('center', null);
      window.spwashi.simulation.force('charge', null);
      window.spwashi.simulation.force('link', null);
      window.spwashi.simulation.force('collide', null);
      window.spwashi.simulation.force(
        'center',
        (alpha) => {
          const nodes = getAllNodes();
          const n     = nodes.length;
          let cx      = 0;
          let cy      = 0;
          for (let i = 0; i < n; ++i) {
            cx += nodes[i].x;
            cy += nodes[i].y;
          }
          cx /= n;
          cy /= n;
          for (let i = 0; i < n; ++i) {
            const d = nodes[i];
            d.x -= cx;
            d.y -= cy;
            if (d.x < 10 || d.y < 10) {
              d.r = 10;
            }
          }
        }
      );
      window.navigator.clipboard.writeText(JSON.stringify({nodes: nodes.map(n => duplicateNode(n)), links}));
      setTimeout(() => {
        removeAllNodes();
        window.spwashi.links.length = 0;
        window.spwashi.reinit();
      }, 300);
      setDocumentMode('');
    }
  },
  {revealOrder: 1, shortcut: '<space>'},
  {revealOrder: 1, shortcut: ';', categories: ['forces', 'velocity decay'], shortcutName: ';', title: 'bonk', callback: bonkVelocityDecay,},
  // {revealOrder: 1, shortcut: 'ArrowLeft', categories: ['forces', 'charge'], shortcutName: '←', title: 'decrease charge', callback: decreaseCharge,},
  // {revealOrder: 1, shortcut: 'ArrowRight', categories: ['forces', 'charge'], shortcutName: '→', title: 'increase charge', callback: increaseCharge},
  {revealOrder: 1, shortcut: '<space>'},
  {revealOrder: 1, shortcut: '.', categories: ['nodes'], title: 'fix position', callback: fixPositions},
  {revealOrder: 1, shortcut: ',', categories: ['nodes'], title: 'unfix position', callback: clearFixedPositions},
  {revealOrder: 1, shortcut: '<space>'},
  {revealOrder: 1, shortcut: 'k', categories: ['data'], title: 'clear nodes', callback: clearActiveNodes},
  {revealOrder: 1, shortcut: '-', categories: ['data', 'cache'], title: 'clear node cache', callback: clearCachedNodes},
  // {revealOrder: 1, shortcut: 'c', categories: ['data'], title: 'copy node ids', callback: copyNodesToClipboard},
  {revealOrder: 1, shortcut: 's', categories: ['nodes'], title: 'save', callback: saveActiveNodes},
  {revealOrder: 1, shortcut: '<space>'},
  {revealOrder: 1, shortcut: 'ArrowDown', categories: ['nodes'], shortcutName: '↓', title: 'fewer', callback: lessNodes},
  {revealOrder: 1, shortcut: '<space>'},
  {revealOrder: 1, shortcut: '\\', categories: ['data', 'cache'], title: 'reset interface', callback: resetInterface},
];
