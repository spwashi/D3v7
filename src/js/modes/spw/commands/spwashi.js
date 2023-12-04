export function runSpwashiCommand(sideEffects) {
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
  ]);
  sideEffects.nextDocumentMode = 'spw';
}