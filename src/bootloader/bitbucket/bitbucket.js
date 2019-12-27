import HashMap from 'hashmap';
import ButtonState from 'src/button/button';
import * as observer from 'src/utils/observer';
import { generateTaskNotes } from '../../utils/quill';
import '../global.less';
import './bitbucket.less';

const buttons = new HashMap();

function createObserver() {
  observer
    .create('#issue-title, .issue-list--title a')
    .onAdded(createButton)
    .onRemoved(removeButton)
    .start();
}

function createButton(titleEl) {
  const name = titleEl.innerText;
  const link = location.href;

  const state = new ButtonState({
    task: {
      name,
      notes: generateTaskNotes('Bitbucket', location.href),
    },
    link,
    anchor: 'screen',
  });

  const buttonEl = state.button.render().el;
  titleEl.appendChild(buttonEl);

  buttons.set(titleEl, state);
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
