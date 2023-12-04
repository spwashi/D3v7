export function runAllCommand(sideEffects) {
  {
    const all = window.spwashi.nodes.map(node => node.id).join('\n');
    sideEffects.valueStrings.push(all);
    sideEffects.nextDocumentMode = 'spw';
    return;
  }
}