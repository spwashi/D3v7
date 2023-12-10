import "../../css/style.css";
import "../../css/dataindex.css";
import "../../css/_spwashi@.scss";
import {app}             from '../../js'
import {processSpwInput} from "../../js/modes/spw/process-spw-input";
import {mainLoop}        from "./loop/head";
import {gameState}       from "./state/state";
import "./env/augmentations";

const interval = 50;
const motion   = {charge: 1000}
const state    = gameState();

app()
  .then(() => {
    processSpwInput(['box=0']);
    mainLoop(interval, motion, state);
  });