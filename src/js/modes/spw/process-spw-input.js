import {reinitializeSimulation}                                       from "../../simulation/simulation";
import {initKeystrokes, saveActiveNodes, toggleInterfaceDepthOptions} from "../../init/hotkeys";
import {initFocalSquare}                                              from "../../focalPoint";
import {moreMenuOptionsSpell}                                         from "../mode-story";
import {initPageImage, setPageImage}                                  from "../../ui/page-image";
import {processLine}                                                  from "./process-line";

const helpText = [
  'thoughts are nodes',
  'text can be linked'
];

export function initSpwParseField() {
  const value    = window.spwashi.getItem('parameters.spw-parse-field') || '';
  const spwInput = document.querySelector('#spw-parse-field');
  spwInput.value = value;
  // listen for image paste events
  spwInput.addEventListener('paste', (e) => {
    const items = (e.clipboardData || e.originalEvent.clipboardData).items;
    for (const item of items) {
      if (item.type.indexOf('image') === 0) {
        const blob     = item.getAsFile();
        var fileReader = new FileReader();

        fileReader.onload = function (fileLoadedEvent) {
          const srcData = fileLoadedEvent.target.result; // <--- data: base64
          const img     = setPageImage(srcData);
        };
        fileReader.readAsDataURL(blob);
        initPageImage();
      }
    }
  });
  return spwInput;
}

export function pushHelpTopics(yPos) {
  const topics = [
    {
      id:          'help--home',
      name:        'home',
      description: 'go to home page',
      r:           30,
      url:         '/'
    },
  ]
  window.spwashi.nodes.push(...topics.map(node => {
    node.fy = yPos;
    return node;
  }));
  window.spwashi.reinit();
}

function runHelpCommand(sideEffects) {
  {
    window.spwashi.setItem('help', helpText.join('\n'), 'focal.root')
    window.spwashi.nodes.push(
      {
        fx:              window.spwashi.parameters.startPos.x,
        fy:              window.spwashi.parameters.startPos.y,
        id:              'help',
        name:            'help',
        kind:            '__help',
        r:               30,
        collisionRadius: 100,
        charge:          -100,
        url:             '/help',
        callbacks:       {
          click(e, d) {
            d.fx    = d.fy = undefined;
            const y = d.y;
            const x = d.x;
            pushHelpTopics(y);
          }
        }
      }
    );
    sideEffects.physicsChange = true;
    return;
  }
}

function runHomeCommand() {
  window.location.href = '/'
  return;
}

function runDemoCommand(sideEffects) {
  {
    sideEffects.valueStrings.push('add=10');
    sideEffects.valueStrings.push('bonk');
    sideEffects.valueStrings.push('boundingBox=1');
    sideEffects.valueStrings.push('charge=-100');
    sideEffects.valueStrings.push('velocityDecay=0.9');
    sideEffects.valueStrings.push('nodeCount=1');
    sideEffects.valueStrings.push('boon');
    sideEffects.valueStrings.push('bonk');
    sideEffects.valueStrings.push('nodeCount=3');
    sideEffects.valueStrings.push('boon');
    sideEffects.valueStrings.push('bonk');
    sideEffects.valueStrings.push('minimalism');
    sideEffects.nextDocumentMode = 'spw';
    return;
  }
}

function runAllCommand(sideEffects) {
  {
    const all = window.spwashi.nodes.map(node => node.id).join('\n');
    sideEffects.valueStrings.push(all);
    sideEffects.nextDocumentMode = 'spw';
    return;
  }
}

function runClickedCommand(sideEffects) {
  {
    const clicked                = window.spwashi.nodes.clicked.map(node => node.id).join('\n');
    sideEffects.nextDocumentMode = 'spw';
    sideEffects.valueStrings.push(clicked);
    window.spwashi.nodes.clicked = [];
    return;
  }
}

function runSaveCommand() {
  {
    saveActiveNodes();
    return;
  }
}

function runFreezeCommand() {
  {
    window.spwashi.nodes.forEach(node => {
      node.fx = node.x;
      node.fy = node.y;
    });
    return;
  }
}

function runClusterCommand(sideEffects) {
  {
    const nodeGroups     = window.spwashi.nodes.reduce((acc, node) => {
      const cluster = node.colorindex;
      acc[cluster]  = acc[cluster] || [];
      acc[cluster].push(node);
      return acc;
    }, {});
    window.spwashi.nodes = window.spwashi.nodes.filter(node => node.kind !== '__cluster');
    window.spwashi.links = window.spwashi.links.filter(link => link.source.kind !== '__cluster' && link.target.kind !== '__cluster');
    Object.entries(nodeGroups)
          .forEach(([cluster, nodes]) => {
            const clusterNode = {
              id:   cluster,
              kind: '__cluster',
              r:    100,
            };
            window.spwashi.nodes.push(clusterNode);
            nodes.forEach(node => {
              window.spwashi.links.push({source: clusterNode, target: node, strength: 1});
            });
          });
    sideEffects.physicsChange = true;
    return;
  }
}

function runMinimalismCommand() {
  {
    window.spwashi.minimalism = true;
    toggleInterfaceDepthOptions();
    document.body.dataset.displaymode = 'nodes';
    return;
  }
}

function runScatterCommand() {
  {
    window.spwashi.nodes.forEach(node => {
      node.x = Math.random() * 1000;
      node.y = Math.random() * 1000;
    });
    reinitializeSimulation();
    return;
  }
}

function runLinkCommand() {
  {
    const nodes = window.spwashi.nodes;
    nodes.forEach((node, i) => {
      const source = nodes[i];
      const target = nodes[(i + 1) % nodes.length];
      window.spwashi.links.push({source, target, strength: .1});
    });
    reinitializeSimulation();
    return;
  }
}

function runBoneCommand() {
  {
    window.spwashi.bone();
    return;
  }
}

function runBoonCommand() {
  {
    window.spwashi.boon();
    return;
  }
}

function runHonkCommand() {
  {
    window.spwashi.honk();
    return;
  }
}

function runBonkCommand() {
  {
    window.spwashi.bonk();
    return;
  }
}

function runDisplayNodesCommand() {
  {
    const urlParams = new URLSearchParams()
    urlParams.set('display', 'nodes');
    window.spwashi.readParameters(urlParams);
    return;
  }
}

function runClearPageImageCommand() {
  {
    window.spwashi.setItem('parameters.page-image', '');
    initPageImage();
    return;
  }
}

function runClearCommand() {
  {
    window.spwashi.nodes = [];
    window.spwashi.links = [];
    reinitializeSimulation();
    initFocalSquare().focus();
    return;
  }
}

function runMoreMenuOptionsCommand() {
  {
    window.spwashi.keystrokeRevealOrder = 1;
    initKeystrokes();
  }
}

export function processSpwInput(text) {
  const sideEffects = {
    physicsChange:    false,
    nextDocumentMode: '',
    valueStrings:     [],
  }

  const nodeIdCacheObj = {};
  window.spwashi.nodes.forEach(node => nodeIdCacheObj[node.id] = node);
  const nodesImpacted = [];
  const nodesIgnored  = [];

  const liveStrings = [];
  const textLines   = text.split('\n');

  textLines.map(line => {
    if (nodeIdCacheObj[line]) {
      nodesIgnored.push(nodeIdCacheObj[line]);
      return;
    }

    const changed = processLine(line, nodesImpacted);
    if (changed) {
      sideEffects.physicsChange = true;
      return;
    }

    switch (line) {
      case helpText[0]:
      case helpText[1]:
        return;
      case 'help':
        return runHelpCommand(sideEffects);
      case 'home':
        return runHomeCommand();
      case 'demo':
        return runDemoCommand(sideEffects);
      case 'all':
        return runAllCommand(sideEffects);
      case 'clicked':
        return runClickedCommand(sideEffects);
      case 'save':
        return runSaveCommand();
      case 'freeze':
        return runFreezeCommand();
      case 'cluster':
        return runClusterCommand(sideEffects);
      case 'minimalism':
        return runMinimalismCommand();
      case 'scatter':
        return runScatterCommand();
      case 'link':
        return runLinkCommand();
      case 'bone' :
        return runBoneCommand();
      case 'boon':
        return runBoonCommand();
      case 'honk' :
        return runHonkCommand();
      case 'bonk':
        return runBonkCommand();
      case 'display=nodes':
        return runDisplayNodesCommand();
      case 'clear page image':
        return runClearPageImageCommand();
      case 'clear':
        return runClearCommand();
      case moreMenuOptionsSpell:
        return runMoreMenuOptionsCommand();
      default: {
        sideEffects.valueStrings.push(line)
      }
    }

    liveStrings.push(line);
  });

  nodesIgnored.forEach(node => { node.r = 10; });
  nodesImpacted.forEach(node => { node.r = 100; });

  if (sideEffects.physicsChange) {
    reinitializeSimulation();
  }

  return {
    nextDocumentMode: sideEffects.nextDocumentMode,
    liveStrings,
    valueStrings:     sideEffects.valueStrings,
  };
}