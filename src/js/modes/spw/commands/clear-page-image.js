import {initPageImage} from "../../../ui/page-image";

export function runClearPageImageCommand() {
  {
    window.spwashi.setItem('parameters.page-image', '');
    initPageImage();
    return;
  }
}