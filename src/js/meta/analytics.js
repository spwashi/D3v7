export function initAnalytics() {
  let script            = document.createElement('script');
  script.defer          = true;
  script.src            = "https://plausible.io/js/script.js";
  script.dataset.domain = window.location.hostname;

  document.getElementsByTagName('head')[0].appendChild(script);
}