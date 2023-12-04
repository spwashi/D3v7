export function runClickedCommand(sideEffects) {
  {
    const clicked                = window.spwashi.nodes.clicked.map(node => node.id).join('\n');
    sideEffects.nextDocumentMode = 'spw';
    sideEffects.valueStrings.push(clicked);
    window.spwashi.nodes.clicked = [];
    return;
  }
}