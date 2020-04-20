import HashMap from 'hashmap';
import ButtonState from 'src/button/button';
import * as observer from 'src/utils/observer';

import * as content from '../../utils/content';
import { generateTaskNotes } from '../../utils/quill';

const buttons = new HashMap();

function createObserver() {
  observer
    .create('.event-issue-header')
    .onAdded(createButton)
    .onRemoved(removeButton)
    .start();
}

function createButton(element) {
  const containerElement = element.querySelector('a > span > span:first-child');
  const preTitleElement = element.querySelector('a > span > span:first-child');
  const titleElement = element.querySelector('div:last-child');
  const linkElement = element.querySelector('a');

  const preTitle = preTitleElement.innerText;
  const title = titleElement.innerText;
  const name = `${preTitle}: ${title}`;
  const link = linkElement.href;
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
