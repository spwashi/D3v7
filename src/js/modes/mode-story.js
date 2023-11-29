import {readParameters} from "../init/parameters";
import {processNode}    from "../simulation/nodes/processNode";
import {NODE_MANAGER}   from "../simulation/nodes/nodes";

const clearFxFy = d => d.fx = d.fy = undefined;
const fixX      = (d, i) => d.fy = 75 * i;
const fixY      = (d, i) => d.fx = 75;


async function* loopOverTimeEntries(events) {
  for (let {delay, payload} of events) {
    await new Promise(r => setTimeout(r, delay));
    yield payload;
  }
}

async function runStory(events) {
  for await (const payload of loopOverTimeEntries(events)) {
    if (payload.effect) {
      payload.effect();
    }
    if (payload.params) {
      readParameters(new URLSearchParams(payload.params));
    }
    if (payload.nodes) {
      const nodes = payload.nodes.map(processNode).map(NODE_MANAGER.normalize);
      window.spwashi.nodes.push(...nodes);
    }
    window.window.spwashi.reinit();
  }
}

const stories = {
  basic: {
    params:   {
      title:         'demo',
      width:         300,
      height:        500,
      mode:          'spw',
      superpower:    'hyperlink',
      velocityDecay: 0.9,
      center:        250
    },
    runStory: () => {
      const delay1     = 100;
      const delay2     = 300;
      const events =
              [
                {delay: delay1, payload: {nodes: [{r: 10, fx: 30, text: {fx: 75, fontSize: 30}, fy: 50, name: 'hello'}]},},
                {delay: delay1, payload: {nodes: [{r: 10, fx: 30, text: {fx: 75, fontSize: 30}, fy: 100, name: 'how'}]},},
                {delay: delay1, payload: {nodes: [{r: 10, fx: 30, text: {fx: 75, fontSize: 30}, fy: 150, name: 'are'}]},},
                {delay: delay1, payload: {nodes: [{r: 10, fx: 30, text: {fx: 75, fontSize: 30}, fy: 200, name: 'you'}]},},
                {delay: delay1, payload: {nodes: [{r: 10, fx: 30, text: {fx: 75, fontSize: 30}, fy: 250, name: 'doing'}]},},
                {delay: delay1, payload: {nodes: [{r: 10, fx: 30, text: {fx: 75, fontSize: 30}, fy: 300, name: 'today'}]},},

                {delay: delay1, payload: {params: {width: 500, height: 500}},},

                {delay: delay2, payload: {effect: () => window.spwashi.nodes.forEach(clearFxFy)},},
                {delay: delay2, payload: {params: {charge: 500}},},
                {delay: delay2, payload: {effect: () => window.spwashi.nodes.forEach(d => d.r = 3)},},
                {delay: delay2, payload: {effect: () => window.spwashi.nodes.forEach(fixX)},},
                {delay: delay2, payload: {effect: () => window.spwashi.nodes.forEach(fixY)},},
                {delay: delay2, payload: {effect: () => window.spwashi.nodes.forEach(clearFxFy)},},
                {delay: delay2, payload: {effect: () => window.spwashi.nodes.forEach(fixY)},},
                {delay: delay2, payload: {effect: () => window.spwashi.nodes.forEach(fixX)},},
                {delay: delay2, payload: {effect: () => window.spwashi.nodes.forEach(clearFxFy)},},
                {delay: delay2, payload: {effect: () => window.spwashi.nodes.forEach(fixX)},},
                {delay: delay2, payload: {effect: () => window.spwashi.nodes.forEach(fixY)},},
                {delay: delay2, payload: {effect: () => window.spwashi.nodes.forEach(clearFxFy)},},
                {delay: delay2, payload: {effect: () => window.spwashi.nodes.forEach(fixY)},},
                {delay: delay2, payload: {effect: () => window.spwashi.nodes.forEach(fixX)},},
                {delay: delay2, payload: {effect: () => window.spwashi.nodes.forEach(clearFxFy)},},
                {delay: delay2, payload: {effect: () => window.spwashi.nodes.forEach(fixX)},},
                {delay: delay2, payload: {effect: () => window.spwashi.nodes.forEach(fixY)},},
                {delay: delay2, payload: {effect: () => window.spwashi.nodes.forEach(clearFxFy)},},
                {delay: delay2, payload: {effect: () => window.spwashi.nodes.forEach(fixY)},},
                {delay: delay2, payload: {effect: () => window.spwashi.nodes.forEach(fixX)},},
                {delay: delay2, payload: {effect: () => window.spwashi.nodes.forEach(clearFxFy)},},
                {delay: delay2, payload: {effect: () => window.spwashi.nodes.forEach(fixY)},},
                {delay: delay2, payload: {effect: () => window.spwashi.nodes.forEach(fixX)},},
                {delay: delay2, payload: {effect: () => window.spwashi.nodes.forEach(clearFxFy)},},
              ]
      runStory(events).then(console.log);
    }
  }
};

export function initializeStoryMode() {
  const storyModeContainer     = document.querySelector('#story-mode-container');
  storyModeContainer.innerHTML = '';
  const buttonContainer        = document.createElement('div');
  buttonContainer.classList.add('button-container');
  storyModeContainer.appendChild(buttonContainer)
  Object.entries(stories).forEach(([key, story]) => {
    const button     = document.createElement('button');
    button.innerText = story.params.title;
    button.onclick   = () => {
      readParameters(new URLSearchParams(story.params));
      story.runStory();
    };
    buttonContainer.appendChild(button);
  })
}