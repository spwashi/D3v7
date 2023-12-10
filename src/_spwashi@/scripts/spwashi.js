import "../../css/style.css";
import "../../css/dataindex.css";
import "../../css/_spwashi@.scss";
import {app}             from '../../js'
import {processSpwInput} from "../../js/modes/spw/process-spw-input";
import {mainLoopHandler} from "./loop";

import "./augmentations";
import {gameState}       from "./gameState";

const MAIN_LOOP_INTERVAL = 50;

app()
  .then(() => {
    processSpwInput(['box=0',]);
    const stateVariables = gameState();
    mainLoopHandler(MAIN_LOOP_INTERVAL, {charge: 1000}, stateVariables);
  });