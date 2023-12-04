import {generateNodes}  from "../../simulation/nodes/generateNodes";
import {executeCommand} from "./execute-command";

const patternsAndHandlers = {
  at:              {
    regex:   /@=(.+)/,
    handler: (value) => {
      const identities = value.split(',');
      identities.forEach(id => {
        const node = window.spwashi.nodes.find(node => node.id === id || node.identity === id);
        if (node) {
          sideEffects.nodesImpacted.push(node);
        }
      });
      sideEffects.physicsChange = true;
    }
  },
  add:             {
    regex:   /add=(-?\d+)/,
    handler: (value) => {
      generateNodes(parseInt(value));
      sideEffects.physicsChange = true;
    }
  },
  boundingBox:     {
    regex:   /boundingBox=(-?\d+)/,
    handler: (value) => {
      window.spwashi.parameters.forces.boundingBox = !!parseInt(value);
      sideEffects.physicsChange                    = true;
    }
  },
  charge:          {
    regex:   /charge=(-?\d+)/,
    handler: (value) => {
      window.spwashi.parameters.forces.charge = parseInt(value);
      sideEffects.physicsChange               = true;
    }
  },
  velocityDecay:   {
    regex:   /velocityDecay=(-?\d*\.?\d+)/,
    handler: (value) => {
      window.spwashi.parameters.forces.velocityDecay = parseFloat(value);
      sideEffects.physicsChange                      = true;
    }
  },
  nodeQueue:       {
    regex:   /nodeCount=(\d+)/,
    handler: (value) => {
      window.spwashi.parameters.nodes.count = parseInt(value);
      sideEffects.physicsChange             = true;
    }
  },
  collisionRadius: {
    regex:   /cr=(\d+)/,
    handler: (value) => {
      window.spwashi.nodes.forEach(node => node.collisionRadius = parseInt(value) * node.r);
      sideEffects.physicsChange = true;
    }
  },
  radius:          {
    regex:   /r=(\d+)/,
    handler: (value) => {
      window.spwashi.nodes.forEach(node => node.r = parseInt(value));
      sideEffects.physicsChange = true;
    }
  },
  superpower:      {
    regex:   /!(.+)/,
    handler: (value) => {
      window.spwashi.superpower = {name: value, intent: 1};
      sideEffects.physicsChange = true;
    }
  },
  url:             {
    regex:   /https:\/\/(.+)/,
    handler: (value) => {
      const node = {
        name:            value,
        url:             `https://${value}`,
        collisionRadius: 100,
        r:               20,
        fx:              window.spwashi.parameters.width / 2,
      };
      window.spwashi.nodes.push(node);
      sideEffects.nodesAdded.push(node);
      sideEffects.valueStrings.push(node.url);
    }
  }
};

export function processLine(line, sideEffects) {
  let handled = false;
  Object.entries(patternsAndHandlers).forEach(([key, {regex, handler}]) => {
    const match = regex.exec(line);
    if (match && match[1]) {
      handled = true;
      handler(match[1]);
    }
  });
  if (handled) return;
  executeCommand(line, sideEffects);
  return false;
}