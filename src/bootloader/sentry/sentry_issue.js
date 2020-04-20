import HashMap from 'hashmap';
import ButtonState from 'src/button/button';
import * as observer from 'src/utils/observer';

import * as content from '../../utils/content';
import { generateTaskNotes } from '../../utils/quill';

const buttons = new HashMap();

function createObserver() {
  observer
    .create('.group-detail .row')
    .onAdded(createButton)
    .onRemoved(removeButton)
    .start();
}

function createButton(element) {
  const containerElement = element.querySelector('h3 + div');
  const preTitleElement = element.querySelector('h3 span > span:first-child');
  const titleElement = element.querySelector('h3 + div > span:nth-child(2)');

  const preTitle = preTitleElement.innerText;
  const title = titleElement.innerText;
  const name = `${preTitle}: ${title}`;
  const link = window.location.href;
  const notes = generateTaskNotes('Sentry', link);

  const state = new ButtonState({
    link,
    task: {
      name,
      notes,
    },
    anchor: 'element',
  });

  content.appendOrReplace(state, containerElement);
  buttons.set(containerElement, state);
}

function removeButton(node) {
  const button = buttons.get(node);
  if (button) {
    button.remove();
  }
}

function handleError(error) {
  console.error(error);
}

if (!ButtonState.isLoaded()) {
  ButtonState.initialize()
    .then(createObserver)
    .catch(handleError);
}
