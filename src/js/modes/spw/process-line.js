import {generateNodes} from "../../simulation/nodes/generateNodes";

export function processLine(line, nodesImpacted) {
  const at            = /@=(.+)/.exec(line)?.[1];
  const add           = /add=(-?\d+)/.exec(line)?.[1];
  const boundingBox   = /boundingBox=(-?\d+)/.exec(line)?.[1];
  const charge        = /charge=(-?\d+)/.exec(line)?.[1];
  const velocityDecay = /velocityDecay=(-?\d*\.?\d+)/.exec(line)?.[1];
  const nodeQueue     = /nodeCount=(\d+)/.exec(line)?.[1];
  const radius        = /r=(\d+)/.exec(line)?.[1];
  const superpower    = /!(.+)/.exec(line)?.[1];

  if (superpower) {
    window.spwashi.superpower = {name: superpower, intent: 1};
    return true;
  }

  if (radius) {
    window.spwashi.nodes.forEach(node => node.r = parseInt(radius));
    return true;
  }

  if (at) {
    const identities = at.split(',');
    identities.map(id => {
      const node = window.spwashi.nodes.find(node => node.id === id || node.identity === id);
      node && nodesImpacted.push(node);
    })
    return true;
  }

  if (add) {
    generateNodes(parseInt(add));
    return true;
  }

  if (boundingBox) {
    window.spwashi.parameters.forces.boundingBox = !!parseInt(boundingBox);
    return true;
  }

  if (charge) {
    window.spwashi.parameters.forces.charge = parseInt(charge);
    return true;
  }

  if (velocityDecay) {
    window.spwashi.parameters.forces.velocityDecay = parseFloat(velocityDecay);
    return true;
  }

  if (nodeQueue) {
    window.spwashi.parameters.nodes.count = parseInt(nodeQueue);
    return true;
  }

  return false;
}