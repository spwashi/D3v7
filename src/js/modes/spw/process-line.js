import {executeCommand}                                  from "./execute-command";
import {scaleOrdinal, scaleSequential, schemeCategory10} from "d3";
import {processNode, setNodeHash}                        from "../../simulation/nodes/processNode";
import {NODE_MANAGER}                                    from "../../simulation/nodes/nodes";

const patternsAndHandlers = {
  at:              {
    regex:   /^@=(.+)/,
    handler: (sideEffects, value) => {
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
    regex:   /^add=(-?\d+)/,
    handler: (sideEffects, value) => {
      const quantity = parseInt(value);
      const nodes    = [...Array(quantity)].map((n, i) => ({
        name: i + '',
        id:   Date.now() + Math.random(),
      }));
      window.spwashi.nodes.push(...nodes.map(NODE_MANAGER.normalize).map(processNode));
      sideEffects.nodesAdded.push(...nodes);
      sideEffects.physicsChange = true;
    }
  },
  boundingBox:     {
    regex:   /^boundingBox=(-?\d+)/,
    handler: (sideEffects, value) => {
      window.spwashi.parameters.forces.boundingBox = !!parseInt(value);
      sideEffects.physicsChange                    = true;
    }
  },
  charge:          {
    regex:   /^charge=(-?\d+)/,
    handler: (sideEffects, value) => {
      window.spwashi.parameters.forces.charge = parseInt(value);
      sideEffects.physicsChange               = true;
    }
  },
  velocityDecay:   {
    regex:   /^velocityDecay=(-?\d*\.?\d+)/,
    handler: (sideEffects, value) => {
      window.spwashi.parameters.forces.velocityDecay = parseFloat(value);
      sideEffects.physicsChange                      = true;
    }
  },
  nodeQueue:       {
    regex:   /^nodeCount=(\d+)/,
    handler: (sideEffects, value) => {
      window.spwashi.parameters.nodes.count = parseInt(value);
      sideEffects.physicsChange             = true;
    }
  },
  collisionRadius: {
    regex:   /^cr=(\d+)/,
    handler: (sideEffects, value) => {
      window.spwashi.nodes.forEach(node => node.collisionRadius = parseInt(value) * node.r);
      sideEffects.physicsChange = true;
    }
  },
  radius:          {
    regex:   /^r=(\d+)/,
    handler: (sideEffects, value) => {
      window.spwashi.nodes.forEach(node => node.r = parseInt(value));
      sideEffects.physicsChange = true;
    }
  },
  superpower:      {
    regex:   /^!(.+)/,
    handler: (sideEffects, value) => {
      window.spwashi.superpower = {name: value, intent: 1};
      sideEffects.physicsChange = true;
    }
  },
  url:             {
    regex:   /^https:\/\/(.+)/,
    handler: (sideEffects, value) => {
      const node = {
        name:            value,
        url:             `https://${value}`,
        collisionRadius: 30,
        r:               20,
        charge:          -1000,
        fx:              window.spwashi.parameters.width / 2,
      };
      window.spwashi.nodes.push(node);
      sideEffects.nodesAdded.push(node);
      sideEffects.valueStrings.push(node.url);
    }
  },
  color:           {
    regex:   /^color=(-?\d+)/,
    handler: (sideEffects, value) => {
      const choice  = parseInt(value);
      const reverse = Math.sign(choice) !== -1 || Object.is(choice, -0);
      const nodes   = [...window.spwashi.nodes];
      if (reverse) {
        nodes.reverse();
      }
      const options = [
        scaleOrdinal(schemeCategory10),
        scaleSequential([0, nodes.length], t => `hsl(230, ${t * 100}%, 50%)`),
        scaleSequential([0, nodes.length], t => `hsl(230, 100%, ${t * 50}%)`),
        scaleSequential([0, nodes.length], t => `hsl(${t * 360}, 100%, 50%)`),
      ];
      const scale   = options[Math.abs(choice) % options.length];
      nodes.forEach((node, i) => {
        console.log(node.name)
        node.color = scale(i);
      });
      sideEffects.physicsChange = true;
    }
  },
  size:            {
    regex:   /^size=(\d+)/,
    handler: (sideEffects, value) => {
      const choice  = parseInt(value);
      const nodes   = window.spwashi.nodes;
      const options = [
        scaleSequential([0, nodes.length], t => t * 30),
        scaleSequential([0, nodes.length], t => t * 60),
        scaleSequential([0, nodes.length], t => t * 90),
        scaleSequential([0, nodes.length], t => t * 120),
      ];
      const scale   = options[choice % options.length];
      nodes.forEach((node, i) => {
        node.r = scale(i);
      });
      sideEffects.physicsChange = true;
    }
  },
  sort:            {
    regex:   /^sort=(.+)/,
    handler: (sideEffects, value) => {
      const choice  = value;
      const nodes   = window.spwashi.nodes;
      const options = {
        "name":        (a, b) => a.name.localeCompare(b.name),
        "name+":       (a, b) => a.name.localeCompare(b.name),
        "name-":       (a, b) => b.name.localeCompare(a.name),
        "r":           (a, b) => a.r - b.r,
        "r+":          (a, b) => a.r - b.r,
        "r-":          (a, b) => b.r - a.r,
        "cluster":  (a, b) => a.colorindex - b.colorindex,
        "cluster-": (a, b) => a.colorindex - b.colorindex,
        "cluster+": (a, b) => b.colorindex - a.colorindex,
        "z":           (a, b) => a.z - b.z,
        "z+":          (a, b) => a.z - b.z,
        "z-":          (a, b) => b.z - a.z,
      };
      const sort    = options[choice];
      if (!sort) return;
      nodes.sort(sort);
      sideEffects.physicsChange = true;
    }
  },
  name:            {
    regex:   /^name=(.+)/,
    handler: (sideEffects, value) => {
      const choice        = value;
      const nodes         = window.spwashi.nodes;
      const namingOptions = {
        "identity": (node) => node.identity,
        "name":     (node) => node.private.name || node.name,
        "url":      (node) => node.url,
        "hash":     (node) => setNodeHash(node),
        "pos":      (node, i) => `${i}`,
      };
      const naming        = namingOptions[choice];
      if (!naming) return;
      nodes.forEach((node, i) => {
        node.private.name = node.private.name || node.name;
        node.name         = naming(node, i) || node.name;
      });
      sideEffects.physicsChange = true;
    }
  },
  fontSize:        {
    regex:   /^fontSize=(\d+)/,
    handler: (sideEffects, value) => {
      const choice = parseInt(value);
      const nodes  = window.spwashi.nodes;
      nodes.forEach((node, i) => {
        node.text.fontSize = choice;
      });
      sideEffects.physicsChange = true;
    }
  }
};

export function processLine(line, sideEffects) {
  let handled = false;
  Object.entries(patternsAndHandlers).forEach(([key, {regex, handler}]) => {
    const match = regex.exec(line);
    if (match && match[1]) {
      handled      = true;
      const values = match.slice(1)
      handler(sideEffects, ...values);
    }
  });
  if (handled) return;
  executeCommand(line, sideEffects);
  return false;
}