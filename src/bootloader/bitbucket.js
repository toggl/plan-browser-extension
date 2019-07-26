const HashMap = require('hashmap');
const ButtonState = require('../button/button');
const observer = require('../utils/observer');
const { generateTaskNotes } = require('../utils/quill');

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
