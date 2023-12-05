import {removeAllNodes}      from "../../simulation/nodes/data/set";
import {removeAllLinks}      from "../../simulation/edges/data/set";
import {duplicateNode}       from "../../modes/direct/mode-direct";
import {getAllNodes}         from "../../simulation/nodes/data/selectors/multiple";
import {getAllLinks}         from "../../simulation/edges/data/select";
import {setDocumentMode}     from "../../modes";
import {toggleFocalPoint}    from "./handlers/toggle-focal-point";
import {clearCachedNodes}    from "./handlers/clear-cached-nodes";
import {clearFixedPositions} from "./handlers/clear-fixed-positions";
import {fixPositions}        from "./handlers/fix-positions";
import {clearActiveNodes}    from "./handlers/clear-active-nodes";
import {saveActiveNodes}     from "./handlers/save-active-nodes";
import {lessNodes}           from "./handlers/less-nodes";
import {bonkVelocityDecay}   from "./handlers/bonk-velocity-decay";
import {toggleHotkeyMenu}    from "./handlers/toggle-hotkey-menu";
import {moreNodes}           from "./handlers/more-nodes";

import {resetInterface} from "./handlers/reset-interface";
import {toggleMainMenu} from "./handlers/toggle-main-menu";

export const initialKeyStrokeOptions = [
  {revealOrder: 0, shortcut: 'ArrowUp', categories: ['nodes'], shortcutName: '↑', title: 'more', callback: moreNodes},
  {revealOrder: 0, shortcut: '[', categories: ['this'], title: 'toggle main menu', callback: () => { toggleMainMenu(); }},
  {revealOrder: 0, shortcut: ']', categories: ['this'], title: 'toggle focal point', callback: toggleFocalPoint},
  {revealOrder: 1, shortcut: '/', categories: ['this'], title: 'toggle hotkey menu', callback: () => toggleHotkeyMenu()},
  {
    revealOrder: 0, shortcut: 'y', categories: ['this'], title: 'yoink', callback: () => {
      const nodes = getAllNodes();
      const links = getAllLinks();
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
        removeAllLinks();
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
  {revealOrder: 0, shortcut: 's', categories: ['nodes'], title: 'save', callback: saveActiveNodes},
  {revealOrder: 1, shortcut: '<space>'},
  {revealOrder: 1, shortcut: 'ArrowDown', categories: ['nodes'], shortcutName: '↓', title: 'fewer', callback: lessNodes},
  {revealOrder: 1, shortcut: '<space>'},
  {revealOrder: 1, shortcut: '\\', categories: ['data', 'cache'], title: 'reset interface', callback: resetInterface},
];