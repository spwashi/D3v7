import {getAllNodes}                                         from "./nodes/data/selectors/multiple";
import {forceCenter, forceCollide, forceLink, forceManyBody} from "d3";

function getAlpha() {
  return window.spwashi.parameters.forces.alpha;
}

function getAlphaTarget() {
  return window.spwashi.parameters.forces.alphaTarget;
}

function getDecay() {
  return window.spwashi.parameters.forces.alphaDecay;
}

function getVelocityDecay() {
  return window.spwashi.parameters.forces.velocityDecay;
}

export function initializeForces() {
  const simulation = window.spwashi.simulation;
  const links      = window.spwashi.links;
  const nodes      = getAllNodes();

  simulation.alpha(getAlpha());
  simulation.alphaTarget(getAlphaTarget());
  simulation.alphaDecay(getDecay());
  simulation.velocityDecay(getVelocityDecay());

  simulation.force(
    'link',
    forceLink()
      .links(links)
      .id(d => d.id)
      .strength(l => l.strength || 1)
  );
  simulation.force(
    'collide',
    forceCollide(d => d.collisionRadius || d.r)
  );
  simulation.force('charge', null)
  simulation.force(
    'charge',
    forceManyBody()
      .strength(d => d.charge || window.spwashi.parameters.forces.charge)
  );
  simulation.force(
    'center',
    forceCenter(...[
      window.spwashi.parameters.forces.centerPos.x,
      window.spwashi.parameters.forces.centerPos.y,
    ]).strength(window.spwashi.parameters.forces.centerStrength)
  );
  simulation.force('boundingBox', null);
  window.spwashi.parameters.forces.boundingBox && simulation.force('boundingBox', (alpha) => {
    for (let i = 0, n = nodes.length, k = alpha * 0.1; i < n; ++i) {
      const node = nodes[i];
      if (node.x > window.spwashi.parameters.width) {
        node.x = window.spwashi.parameters.width;
        node.vx *= .9;
      } else if (node.x < 0) {
        node.x = 0;
        node.vx *= .9;
      }
      if (node.y > window.spwashi.parameters.height) {
        node.y = window.spwashi.parameters.height;
        node.vy *= .9;
      } else if (node.y < 0) {
        node.y = 0;
        node.vy *= .9;
      }
    }
  });
}