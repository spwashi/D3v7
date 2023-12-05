import {readParameters} from "../../../init/parameters";

export function runDisplayNodesCommand() {
  {
    const urlParams = new URLSearchParams()
    urlParams.set('display', 'nodes');
    readParameters(urlParams);
  }
}