import {getDocumentDataIndex} from "../../dataindex/util";

export const boonConcept = {
  '@node': (index, batchSize) => boonNode(index, batchSize)
}

export function boonNode(i, nodeCount) {
  const sliceWidth = (window.spwashi.parameters.width * .9) / nodeCount;

  return {
    name:        '#',
    kind:        '__boon',
    r:           50,
    fx:          (sliceWidth * (i)) + (sliceWidth * (nodeCount - 1) / nodeCount),
    fy:          window.spwashi.parameters.height / 2,
    color:       'turquoise',
    stroke:      '#ffffff',
    strokeWidth: 1,
    colorindex:  getDocumentDataIndex()
  };
}

export function runBoonCommand() {
  {
    window.spwashi.boon();
    return;
  }
}