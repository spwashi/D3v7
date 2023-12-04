import {getAllNodes} from "../../../simulation/nodes/data/select";

export const sortHandler = {
  regex:   /^sort=(.+)/,
  handler: (sideEffects, value) => {
    const choice  = value;
    const nodes   = getAllNodes();
    const options = {
      "name":     (a, b) => a.name.localeCompare(b.name),
      "name+":    (a, b) => a.name.localeCompare(b.name),
      "name-":    (a, b) => b.name.localeCompare(a.name),
      "r":        (a, b) => a.r - b.r,
      "r+":       (a, b) => a.r - b.r,
      "r-":       (a, b) => b.r - a.r,
      "cluster":  (a, b) => a.colorindex - b.colorindex,
      "cluster-": (a, b) => a.colorindex - b.colorindex,
      "cluster+": (a, b) => b.colorindex - a.colorindex,
      "z":        (a, b) => a.z - b.z,
      "z+":       (a, b) => a.z - b.z,
      "z-":       (a, b) => b.z - a.z,
    };
    const sort    = options[choice];
    if (!sort) return;
    nodes.sort(sort);
    sideEffects.physicsChange = true;
  }
};