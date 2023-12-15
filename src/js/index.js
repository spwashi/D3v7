import {initFocalSquare}    from "./ui/focal-point";
import {initH1}             from "./ui/h1";
import {initUi}             from "./init/ui";
import {initRoot}           from "./init/root";
import {initSvgEvents}      from "./simulation/events";
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
function setSite(site) {
  window.spwashi.site = site;
  window.spwashi.setItem('site', site);
  document.body.dataset.siteName = site;
}
function initSite(site = null) {
  const domain = site || window.location.hostname;
  switch (domain) {
    case 'factshift.com':
      setSite("factshift.com")
      break;
    case 'boon.land':
      setSite("boon.land")
      break;
      case 'bane.land':
      setSite("bane.land")
      break;
    case 'bone.land':
      setSite("bone.land")
      break;
    case 'bonk.land':
      setSite("bonk.land")
      break;
    case 'honk.land':
      setSite("honk.land")
      break;
    case 'boof.land':
      setSite("boof.land")
      break;
    case 'lore.land':
      setSite("lore.land")
      break;
    case 'spwashi.com':
      setSite("spwashi.com")
      break;
    case 'localhost':
      setSite("localhost")
      break;
  }
}

export async function app() {
  let serviceWorkerRegistered = registerServiceWorker();

  window.spwashi = {};

  initParameters();
  initRoot();
  initSite();

  // initialize context-sensitive parameters
  loadParameters(new URLSearchParams(window.location.search));

  // primary interactive elements
  initSvgEvents(simulationElements.svg);
  initFocalSquare();
  initH1();

  // progressive enhancement
  initUi(window.spwashi.initialMode);

  return Promise.all([serviceWorkerRegistered])
                .then(() => {

                });
}