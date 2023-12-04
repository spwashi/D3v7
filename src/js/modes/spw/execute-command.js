import {initKeystrokes, saveActiveNodes, toggleInterfaceDepthOptions} from "../../init/hotkeys";
import {initializeForces, reinitializeSimulation}                     from "../../simulation/simulation";
import {initFocalSquare}                                              from "../../focalPoint";
import {initPageImage}                                                from "../../ui/page-image";
import {scaleOrdinal, scaleSequential, schemeCategory10}              from "d3";
import {removeAllNodes, removeClusterNodes}                           from "../../simulation/nodes/set";

export const moreMenuOptionsSpell = `extended menu`.trim();

const helpText = [
  'thoughts are nodes',
  'text can be linked'
];

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
  saveActiveNodes();
}

function runUnfreezeCommand() {
  window.spwashi.nodes.forEach(node => {
    node.fx = node.fy = undefined;
  });
}

function runFreezeCommand() {
  window.spwashi.nodes.forEach(node => {
    node.fx = node.x;
    node.fy = node.y;
  });
}

function getCluster(node) {
  return 'cluster:' + node.colorindex;
}

function runClusterCommand(sideEffects) {
  const nodeGroups = window.spwashi.nodes.reduce((acc, node) => {
    const cluster = getCluster(node);
    acc[cluster]  = acc[cluster] || [];
    acc[cluster].push(node);
    return acc;
  }, {});
  removeClusterNodes();
  window.spwashi.links = window.spwashi.links.filter(link => link.source.kind !== '__cluster' && link.target.kind !== '__cluster');
  Object.entries(nodeGroups)
        .forEach(([cluster, nodes]) => {
          const clusterNode = {
            identity: cluster,
            kind:     '__cluster',
            r:        100,
          };
          window.spwashi.nodes.push(clusterNode);
          nodes.forEach(node => {
            window.spwashi.links.push({source: clusterNode, target: node, strength: 1});
          });
        });
  sideEffects.physicsChange = true;
}

function runMinimalismCommand() {
  {
    window.spwashi.minimalism = true;
    toggleInterfaceDepthOptions();
    document.body.dataset.displaymode = 'nodes';
    return;
  }
}

function runScatterCommand(sideEffects) {
  window.spwashi.nodes.forEach(node => {
    node.x = Math.random() * 1000;
    node.y = Math.random() * 1000;
  });
  sideEffects.physicsChange = true;
}

function runLinkCommand(sideEffects) {
  const nodes = window.spwashi.nodes;
  nodes.forEach((node, i) => {
    const source = nodes[i];
    const target = nodes[(i + 1) % nodes.length];
    window.spwashi.links.push({source, target, strength: .1});
  });
  sideEffects.physicsChange = true;
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
  removeAllNodes();
  window.spwashi.links = [];
  reinitializeSimulation();
  initFocalSquare().focus();
}

function runMoreMenuOptionsCommand() {
  {
    window.spwashi.keystrokeRevealOrder = 1;
    initKeystrokes();
  }
}

function runDefaultCommand(text, sideEffects) {
  sideEffects.valueStrings.push(text)
  sideEffects.liveStrings.push(text);
}

function runForcesCommand(sideEffects) {
  initializeForces();
  sideEffects.physicsChange = true;
}

function runCollisionRadiusCommand(sideEffects) {
  const valueString = sideEffects.valueStrings[0];
  window.spwashi.nodes.forEach(node => node.collisionRadius = parseInt(valueString));
  sideEffects.physicsChange = true;
}

function runSpwashiCommand(sideEffects) {
  sideEffects.valueStrings.push(...[
    'https://spwashi.com',
    'https://lore.land',
    'https://boon.land',
    'https://bane.land',
    'https://bone.land',
    'https://bonk.land',
    'https://honk.land',
    'https://boof.land',
    'https://factshift.com',
    '',
  ]);
  sideEffects.nextDocumentMode = 'spw';
}

function runScaleCommand(sideEffects) {
  // set node color according to scale
  const nodes = window.spwashi.nodes;
  const scale = [
    scaleOrdinal(schemeCategory10),
    scaleSequential([0, nodes.length], t => `hsl(${t * 360}, 100%, 50%)`),
  ][1];
  nodes.forEach((node, i) => {
    node.color = scale(i);
  });
}

const commands = {
  'home':  () => runHomeCommand(),
  'clear': () => runClearCommand(),
  'save':  () => runSaveCommand(),
  'help':  sideEffects => runHelpCommand(sideEffects),

  'spwashi':  sideEffects => runSpwashiCommand(sideEffects),
  'color':    sideEffects => runScaleCommand(sideEffects),
  'freeze':   () => runFreezeCommand(),
  'unfreeze': () => runUnfreezeCommand(),
  'unfix':    () => runUnfreezeCommand(),
  'forces':   sideEffects => runForcesCommand(sideEffects),
  'cr':       sideEffects => runCollisionRadiusCommand(sideEffects),

  'all':     sideEffects => runAllCommand(sideEffects),
  'clicked': sideEffects => runClickedCommand(sideEffects),
  'cluster': sideEffects => runClusterCommand(sideEffects),
  'scatter': sideEffects => runScatterCommand(sideEffects),
  'link':    sideEffects => runLinkCommand(sideEffects),

  'demo':       sideEffects => runDemoCommand(sideEffects),
  'minimalism': () => runMinimalismCommand(),

  'boon': () => runBoonCommand(),
  'bone': () => runBoneCommand(),
  'honk': () => runHonkCommand(),
  'bonk': () => runBonkCommand(),

  // not convinced these are useful
  'display=nodes':        () => runDisplayNodesCommand(),
  'clear page image':     () => runClearPageImageCommand(),
  [moreMenuOptionsSpell]: () => runMoreMenuOptionsCommand(),
  'options':              sideEffects => {
    sideEffects.valueStrings.push(...Object.keys(commands).filter(key => ![
      'options',
      'clear',
      'save',
      'home',
      'help',
    ].includes(key)).map(key => key + '\n'));
    sideEffects.nextDocumentMode = 'spw';
  }
};

export function executeCommand(command, sideEffects) {
  if (commands[command]) {
    return commands[command](sideEffects);
  } else {
    return runDefaultCommand(command, sideEffects);
  }
}