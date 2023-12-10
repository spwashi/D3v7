import "../../css/style.css";
import "../../css/dataindex.css";
import "../../css/_spwashi@.scss";
import {app}             from '../../js'
import {processSpwInput} from "../../js/modes/spw/process-spw-input";
import {mainLoop}        from "./loop/head";

import "./env/augmentations";
import {gameState} from "./state/state";

const MAIN_LOOP_INTERVAL = 50;

app()
  .then(() => {
    processSpwInput(['box=0',]);
    const stateVariables = gameState();
    mainLoop(MAIN_LOOP_INTERVAL, {charge: 1000}, stateVariables);
  });