import {getDataIndexKey, setDocumentMode} from "./index";
import {getColorIndex}                    from "./mode-dataindex";
import {pushLink}                         from "../simulation/edges/links";

export function initializeReflexMode() {
  window.spwashi.boon = () => {
    async function* loop(timeout = 300, count = window.spwashi.parameters.nodes.count) {
      for (let i = 0; i < count; i++) {
        yield i;
        await new Promise(r => setTimeout(r, timeout));
      }
    }

    async function run() {
      for await (const i of loop()) {
        window.spwashi.nodes.push({
                                    name:       'node:' + i,
                                    colorindex: getColorIndex()
                                  });
        window.spwashi.reinit();
      }
    }

    run();
  };
  window.spwashi.bone = () => {
    window.spwashi.links = window.spwashi.links || [];

    const nodeBuckets = new Map();
    for (let node of window.spwashi.nodes) {
      const bucket = nodeBuckets.get(node.colorindex) || [];
      bucket.push(node);
      nodeBuckets.set(node.colorindex, bucket);
    }


    [...nodeBuckets.values()].forEach(arr => {
      let prev;
      let first;
      for (let node of arr) {
        first      = first || node;
        let source = window.spwashi.getNode ? (prev?.id) : '';
        let target = window.spwashi.getNode ? (node.id) : '';
        const link = {
          source:   source,
          target:   target,
          strength: window.spwashi.parameters.links.strength * .3
        };
        source && pushLink(window.spwashi.links, link);
        prev = node;
      }
      pushLink(window.spwashi.links, {
        source:   prev?.id,
        target:   first?.id,
        strength: window.spwashi.parameters.links.strength * .3
      })
    });
    window.spwashi.reinit();
  };
  window.spwashi.bonk = () => {
    window.spwashi.nodes.forEach(n => n.colorindex += 1)
    window.spwashi.reinit();
  };
  window.spwashi.honk = () => {
    window.spwashi.links.forEach(link => link.strength = 1)
    window.spwashi.reinit();
  };

  const radiusReflexes      = [
    [
      '[r *= 3.2]',
      () => {
        window.spwashi.nodes.forEach(n => n.r *= 3.2);
        window.spwashi.reinit()
      },],
    [
      '[r /= 2.3]',
      () => {
        window.spwashi.nodes.forEach(n => n.r /= 2.3);
        window.spwashi.reinit()
      },
    ],
    [
      '[r = 10]',
      () => {
        window.spwashi.nodes.forEach(n => n.r = 10);
        window.spwashi.reinit()
      },
    ],
  ];
  const modeReflexes        = [
    [
      '[mode = spw]',
      () => {
        setDocumentMode('spw');
      },
    ],
    [
      '[mode = null]',
      () => {
        setDocumentMode(null);
      },
    ],
  ];
  const chargeSetReflexes   = [
    [
      '[charge += 100]',
      () => {
        window.spwashi.parameters.forces.charge = 100;
        window.spwashi.reinit();
      },
    ],
    [
      '[charge = 0]',
      () => {
        window.spwashi.parameters.forces.charge = 0;
        window.spwashi.reinit();
      },
    ],
    [
      '[charge = -100]',
      () => {
        window.spwashi.parameters.forces.charge = -100;
        window.spwashi.reinit();
      },
    ],
  ]
  const chargeTweakReflexes = [
    [
      '[charge += 10]',
      () => {
        window.spwashi.parameters.forces.charge += 10;
        window.spwashi.reinit();
      },
    ],
    [
      '[charge -= 10]',
      () => {
        window.spwashi.parameters.forces.charge -= 10;
        window.spwashi.reinit();
      },
    ],
  ];
  const loreReflexes        = [
    [
      'boon',
      () => {
        window.spwashi.boon()
      },
    ],
    [
      'bane',
      () => {
        let arr                     = window.spwashi.nodes.filter(d => d.id.indexOf('node:') < 0);
        window.spwashi.nodes.length = 0;
        window.spwashi.nodes.push(...arr);
        window.spwashi.reinit()
      },
    ],
    [
      'bone',
      () => {
        window.spwashi.bone()
      },
    ],
    [
      'bonk',
      () => {
        window.spwashi.bonk()
      },
    ],
    [
      'honk',
      () => {
        window.spwashi.honk()
      },
    ],
  ];
  const forceReflexes       = [
    [
      '[toggle bounding box]',
      () => {
        window.spwashi.parameters.forces.boundingBox = !window.spwashi.parameters.forces.boundingBox;
        window.spwashi.reinit();
      },
    ],
  ];

  const reflexes        = [
    loreReflexes,
    chargeSetReflexes,
    chargeTweakReflexes,
    radiusReflexes,
    modeReflexes,
    forceReflexes,
  ];
  const reflexContainer = document.querySelector('#reflexes');

  let i = 0;
  reflexes.forEach(reflexGroup => {
    const section = reflexContainer.appendChild(document.createElement('section'));
    reflexGroup.forEach(reflex => {
      const button             = section.appendChild(document.createElement('button'));
      button.innerText         = reflex[0];
      button.onclick           = () => {
        reflex[1]();
        setDocumentMode(null)
      }
      button.dataset.dataindex = getDataIndexKey(i++);
    })
  });
}