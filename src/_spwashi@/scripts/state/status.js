export function resolveStatus(object, currentState) {
  return {
    ...object,
    counter: currentState.counterVariable,
  };
}