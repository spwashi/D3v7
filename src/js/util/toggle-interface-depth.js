export const HOTKEY_OPTION     = 'hotkey-menu';
export const STANDARD_OPTION   = 'standard';
export const MINIMALISM_OPTION = 'minimalism';
export const MAIN_MENU_OPTION  = 'main-menu';

export function toggleInterfaceDepthOptions(options) {
  let nextOption;
  if (options) {
    const currentOption = options.indexOf(document.body.dataset.interfaceDepth);
    const otherOptions  = options.filter((_, i) => i !== currentOption);
    nextOption          = otherOptions[currentOption + 1] || otherOptions[0];
  } else {
    if (window.spwashi.minimalism) {
      nextOption = MINIMALISM_OPTION;
    } else {
      nextOption = STANDARD_OPTION;
    }
  }

  document.body.dataset.interfaceDepth = nextOption;
}