export function initEnableSoundsButton() {
  const enableSoundsButton = document.querySelector('.enable-sounds');
  if (!enableSoundsButton) {
    window.spwashi.callbacks.acknowledgeLonging('wondering about enable sounds button');
    return;
  }
  const disableSoundsButton = document.querySelector('.disable-sounds');
  enableSoundsButton.addEventListener('click', () => {
    document.body.dataset.sounds = 'on';
    window.spwashi.soundsEnabled = true;
  });
  disableSoundsButton.addEventListener('click', () => {
    document.body.dataset.sounds = 'off';
    window.spwashi.soundsEnabled = false;
  });
}