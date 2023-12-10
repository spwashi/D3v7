import {clearActiveNodes}   from "../../js/init/hotkeys/handlers/clear-active-nodes";
import {filterNodes}        from "../../js/simulation/nodes/data/set";
import {mapNodes, pushNode} from "../../js/simulation/nodes/data/operate";
import {processSpwInput}    from "../../js/modes/spw/process-spw-input";
import {pushLink}           from "../../js/simulation/edges/data/pushLink";
import {sleepFn}            from "../../js/util/sleep";
import {gameState}          from "./gameState";

const conditionalResponses     = [
  [
    ({quantity, counter}) => counter >= (quantity * 5),
    (state) => {
      clearActiveNodes();
      window.spwashi.reinit();
      return {
        ...state,
        previousValue:   null,
        counterVariable: 0
      };
    }
  ],
  [
    ({quantity, counter}) => (counter % quantity) === 0,
    (state) => ({
      ...state,
      previousValue: null
    })
  ],
];
const postConditionalResponses = [
  [
    ({quantity, counter}) => counter >= (quantity * 5),
    (state, {interval, nodeCount}) => {
      setTimeout(() => {
        filterNodes((node) => node.kind !== '__boon');
        mapNodes((node) => { node.fy = (node.fy || node.y) + 10; });
      }, (interval * nodeCount * 2 / 3))
      return state;
    }
  ],
  [
    ({quantity, counter}) => (counter % quantity) === 0,
    (state, {interval, nodeCount}) => {
      window.spwashi.boon(interval / 2, nodeCount)
            .then(nodes => {
              nodes.forEach(node => { node.fy += 50; });
              window.spwashi.reinit();
            })
      return state;
    }],
];

function localTickHandler() {
  mapNodes((node) => {
    node.fy += 5;
    node.r += 5;
  });
}

function getLoopCallback(speed, word, {charge = 100}) {
  return async (currentState) => {
    localTickHandler(currentState);
    const presumptiveState = gameState({
      counterVariable: currentState.counterVariable + 1,
    });
    const aggregate        = {__internalword: word};
    const potential        = derivePotential(aggregate);
    const midStep          = intermediate(currentState, presumptiveState, potential);
    const currentNode      = synthesize(potential, aggregate, currentState, midStep);
    window.spwashi.reinit();

    processSpwInput([
      `color=3`,
      'arrange',
      `charge=${charge}`
    ]);

    const nextState = gameState(
      currentState,
      presumptiveState,
      midStep,
      {previousValue: currentNode}
    );

    mainLoopHandler(speed, {charge: -charge}, nextState);

    return nextState;
  };

  function derivePotential(aggregate) {
    return aggregate.__internalword.length;
  }

  function deriveNode(potential, aggregate, currentState) {
    const heightMod         = potential;
    const identity          = aggregate.__internalword.split('')[currentState.counterVariable % potential];
    const fy                = window.spwashi.parameters.height * ((currentState.counterVariable % heightMod) / heightMod);
    const fx                = (((currentState.counterVariable % potential) / potential) * window.spwashi.parameters.width) + ((1 / (2 * potential)) * window.spwashi.parameters.width);
    const newNode           = {
      id:       currentState.counterVariable,
      identity: identity,

      fx: fx,
      fy: fy,
      y:  fy,
    };
    newNode.color           = 'var(--bg-start)';
    newNode.r               = 20;
    newNode.text            = {
      fontSize: 50,
      fy:       50,
      color:    'white'
    }
    newNode.collisionRadius = 100;
    return newNode;
  }

  function intermediate(currentState, presumptiveState, potential) {
    let intermediateState = gameState(currentState, presumptiveState);
    const stepParameters  = {
      quantity: potential,
      counter:  currentState.counterVariable,
    };
    conditionalResponses.forEach(([condition, callback]) => {
      if (condition(stepParameters)) {
        intermediateState = gameState(intermediateState, callback(intermediateState));
      }
    });
    return intermediateState;
  }

  function synthesize(potential, aggregate, currentState, intermediateState) {
    // nodes
    const currentNode = deriveNode(potential, aggregate, currentState);
    pushNode(currentNode);

    // links
    const previousNode = intermediateState.previousValue;
    if (previousNode) {
      pushLink(window.spwashi.links, {
        source:   currentNode,
        target:   previousNode,
        strength: .3
      });
    }
    return currentNode;
  }
}

function getPostLoopCallback(interval = 100, nodeCount = 13) {
  return (currentState) => {
    const checkParams = {
      quantity: nodeCount,
      counter:  currentState.counterVariable,
    };

    let intermediateState = {...currentState};
    postConditionalResponses.forEach(([condition, callback]) => {
      if (condition(checkParams)) {
        const iterationState = callback(currentState, {interval, nodeCount});
        intermediateState    = {
          ...intermediateState,
          ...iterationState
        }
      }
    });

    return {...intermediateState};
  };
}

export async function mainLoopHandler(interval, motion, stateVariables) {
  const locale    = 'en-US';
  const dayName   = (new Date()).toLocaleDateString(locale, {weekday: 'long'}).toLowerCase();
  const nodeCount = 7;

  const loop      = getLoopCallback(interval, dayName, motion);
  const nextState = await sleepFn(interval, loop, stateVariables)

  const postLoopCallback = getPostLoopCallback(interval, nodeCount);
  return postLoopCallback(nextState);
}
