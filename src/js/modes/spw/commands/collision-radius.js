export function runCollisionRadiusCommand(sideEffects) {
  const valueString = sideEffects.valueStrings[0];
  window.spwashi.nodes.forEach(node => node.collisionRadius = parseInt(valueString));
  sideEffects.physicsChange = true;
}