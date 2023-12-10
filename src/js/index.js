import {initFocalSquare}                from "./ui/focal-point";
import {initH1}                         from "./ui/h1";
import {initUi}                         from "./init/ui";
import {initRoot}                       from "./init/root";
import {initSvgEvents}                  from "./simulation/events";
import {simulationElements} from "./simulation/basic";
import {initParameters}     from "./init/parameters/init";
import {loadParameters}     from "./init/parameters/read";

const versions = {
  'v0.0.1': {
    assetPath: 'v0.0.1',
  }
}

async function registerServiceWorker(version = 'v0.0.1') {
  if (!('serviceWorker' in navigator)) { return; }

  const {assetPath} = versions[version];

  try {
    const registration = await navigator.serviceWorker.register(`/${assetPath}/service-worker.js`);
    console.log('Service Worker registered with scope:', registration.scope);
  } catch (e) {
    console.log('Service Worker registration failed:', e);
  }
}

export function app() {
  registerServiceWorker();
  window.spwashi = {};

  // aim to prevent FOUC
  initParameters();
  initRoot();

  // initialize context-sensitive parameters
  loadParameters(new URLSearchParams(window.location.search));

  // primary interactive elements
  initSvgEvents(simulationElements.svg);
  initFocalSquare();
  initH1();

  // progressive enhancement
  initUi(window.spwashi.initialMode)
}