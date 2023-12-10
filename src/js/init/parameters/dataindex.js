import {getDataIndexForNumber, setDocumentDataIndex} from "../../modes/dataindex/util";

export function dataindex__get(searchParameters) {
  if (searchParameters.has('dataindex')) {
    window.spwashi.parameters.dataIndex = +searchParameters.get('dataindex');
    setDocumentDataIndex(getDataIndexForNumber(window.spwashi.parameters.dataIndex));
  }
}