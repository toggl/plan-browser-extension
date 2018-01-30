const HashMap = require('hashmap');
const ButtonState = require('../button/button');
const observer = require('../utils/observer');

const buttons = new HashMap();

function createObserver() {
  observer.create('#issue-view')
    .onAdded(createButton)
    .onRemoved(removeButton)
    .start();
}

function createButton(element) {
  const titleEl = element.querySelector('#issue-title');

  const name = titleEl.innerText;
  const link = location.href;

  const state = new ButtonState({
    task: {
      name,
      notes: 'Added from Bitbucket: ' + location.href
    },
    link,
    anchor: 'screen'
  });

  const buttonEl = state.button.render().el;
  titleEl.appendChild(buttonEl);

  buttons.set(element, state);
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
