import {initializeDirectMode}              from "../modes/direct/mode-direct";
import {initializeQuerystringMode}         from "../modes/querystring/mode-querystring";
import {initializeReflexMode}              from "../modes/reflex/mode-reflex";
import {initializeStoryMode}               from "../modes/story/mode-story";
import {initializeModeSelection}           from "../modes";
import {initializeDataindexMode}           from "../modes/dataindex/mode-dataindex";
import {initKeystrokes}                    from "./hotkeys/_";
import {initializeForceSimulationControls} from "../ui/simulation-controls";
import {initializeSpwParseField}           from "../modes/spw/mode-spw";


export function initUi(mode) {
  initKeystrokes();

  initializeModeSelection(mode);
  initializeSpwParseField();
  initializeReflexMode();
  initializeDirectMode();

  initializeQuerystringMode();
  initializeDataindexMode();
  initializeForceSimulationControls();
  initializeStoryMode();


  import("../modes/mapfilter/mode-mapfilter")
    .then(({initializeMapFilterMode}) => {
      initializeMapFilterMode();
    })
}
