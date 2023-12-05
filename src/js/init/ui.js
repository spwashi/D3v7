import {initializeDirectMode}      from "../modes/direct/mode-direct";
import {initializeQuerystringMode} from "../modes/querystring/mode-querystring";
import {initializeMapFilterMode}   from "../modes/mapfilter/mode-mapfilter";
import {initializeSpwParseField}   from "../modes/spw/mode-spw";
import {initializeReflexMode}      from "../modes/reflex/mode-reflex";
import {initializeStoryMode}       from "../modes/story/mode-story";
import {initializeModeSelection}   from "../modes";
import {initializeDataindexMode}   from "../modes/dataindex/mode-dataindex";
import {initKeystrokes}            from "./hotkeys/_";

export function initUi(mode) {
  initializeDirectMode();
  initializeQuerystringMode();
  initializeMapFilterMode();
  initializeSpwParseField();
  initializeReflexMode();
  initializeStoryMode();
  initializeModeSelection(mode);
  initializeDataindexMode();
  initKeystrokes();
}