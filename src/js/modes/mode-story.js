import {readParameters} from "../init/parameters";

const stories = {
  basic: {
    params: {
      title:      'Basic',
      size:       500,
      superpower: 'hyperlink',
      velocityDecay: 0.9,
      center: 250
    }
  }
};

export function initializeStoryMode() {
  const storyModeContainer = document.querySelector('#story-mode-container');
  const buttonContainer    = storyModeContainer.querySelector('.button-container');
  Object.entries(stories).forEach(([key, story]) => {
    const button     = document.createElement('button');
    button.innerText = story.params.title;
    button.onclick   = () => {
      readParameters(new URLSearchParams(story.params));
    };
    buttonContainer.appendChild(button);
  })
}