import {readParameters}   from "../init/parameters";
import {processNode}      from "../simulation/nodes/processNode";
import {NODE_MANAGER}     from "../simulation/nodes/nodes";
import {clearActiveNodes} from "../init/keystrokes";

const clearFxFy = d => d.fx = d.fy = undefined;
const fixX      = (d, i) => d.fy = 75 * (i + 1);
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

function setParseField() {
  const parseField = document.querySelector('#spw-parse-field');
  parseField.value = "i am doing & today";
  parseField.focus();
  const index = parseField.value.indexOf('&');
  parseField.setSelectionRange(index, index + 1);
}

const stories = {
  basic: {
    params:   {
      title:         'demo',
      width:         300,
      height:        500,
      superpower:    'hyperlink',
      velocityDecay: 0.9,
      center:        '150,250',
    },
    runStory: () => {
      const delay1 = 50;
      const delay2 = 300;
      const events =
              [
                {delay: delay1, payload: {nodes: [{r: 10, x: 30, y: 50, text: {fx: 75, fontSize: 30}, name: 'hello'}]},},
                {delay: delay1, payload: {nodes: [{r: 10, x: 30, y: 100, text: {fx: 75, fontSize: 30}, name: 'how'}]},},
                {delay: delay1, payload: {nodes: [{r: 10, x: 30, y: 150, text: {fx: 75, fontSize: 30}, name: 'are'}]},},
                {delay: delay1, payload: {nodes: [{r: 10, x: 30, y: 200, text: {fx: 75, fontSize: 30}, name: 'you'}]},},
                {delay: delay1, payload: {nodes: [{r: 10, x: 30, y: 250, text: {fx: 75, fontSize: 30}, name: 'doing'}]},},
                {delay: delay1, payload: {nodes: [{r: 10, x: 30, y: 300, text: {fx: 75, fontSize: 30}, name: 'today'}]},},
                {delay: delay2, payload: {params: {charge: 500}},},
                {delay: delay1, payload: {params: {charge: 0}},},
                {delay: delay1, payload: {effect: () => window.spwashi.nodes.forEach((d, i) => (fixY(d, i), fixX(d, i)))},},
                {delay: 300, payload: {effect: () => clearActiveNodes()},},
                {delay: 100, payload: {params: {mode: 'spw'}}},
                {delay: 300, payload: {effect: setParseField}},
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