import {initializeForces} from "../../../simulation/simulation";

export function runForcesCommand(sideEffects) {
  initializeForces();
  sideEffects.physicsChange = true;
}