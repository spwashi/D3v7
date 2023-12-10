import {filterNodes}   from "../../../js/simulation/nodes/data/set";
import {mapNodes}      from "../../../js/simulation/nodes/data/operate";
import {gameState}     from "../state/state";
import {resolveStatus} from "../state/status";

const postConditionalResponses = [
  [
    ({counter = 1, quantity = 1000}) => counter >= (quantity * 5),
    ({quantity = 1, interval = 100}) => {
      setTimeout(() => {
        filterNodes((node) => node.kind !== '__boon');
        mapNodes((node) => { node.fy = (node.fy || node.y) + 10; });
      }, (interval * quantity * 2 / 3))
    }
  ],
  [
    ({counter = 1, quantity = 2}) => (counter % quantity) === 0,
    ({quantity = 1, interval = 1000}) => {
      window.spwashi.boon(interval / 2, quantity)
            .then(nodes => {
              nodes.forEach(node => { node.fy += 50; });
              window.spwashi.reinit();
            })
    }],
];

export function postLoop(object) {
  return (currentState) => {
    const status          = resolveStatus(object, currentState);
    let intermediateState = gameState(currentState);
    postConditionalResponses.forEach(([condition, callback]) => {
      if (condition(status)) {
        const iterationState = callback(status);
        intermediateState    = gameState(intermediateState, iterationState);
      }
    });

    return gameState(intermediateState);
  };
}