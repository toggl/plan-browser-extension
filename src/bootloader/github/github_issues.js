import HashMap from 'hashmap';
import ButtonState from 'src/button/button';
import observer from 'src/utils/observer';
import content from '../../utils/content';
import { generateTaskNotes } from '../../utils/quill';

const buttons = new HashMap();

function createObserver() {
  observer
    .create('.js-issue-title, .js-issue-row .h4')
    .onAdded(createButton)
    .onRemoved(removeButton)
    .start();
}

function createButton(title) {
  const name = title.innerText;
  const link = title.href;

  const state = new ButtonState({
    link,
    task: {
      name,
      notes: generateTaskNotes('GitHub', link),
    },
    anchor: 'element',
  });

  content.appendOrReplace(state, title);

  buttons.set(title, state);
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
