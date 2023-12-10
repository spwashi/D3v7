export function gameState(...ingredients) {
  return {
    previousValue:   null,
    counterVariable: 0,
    ...ingredients.reduce((acc, ingredient) => ({...acc, ...ingredient}), {})
  }
}