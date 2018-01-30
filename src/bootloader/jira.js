const HashMap = require('hashmap');
const ButtonState = require('../button/button.js');
const observer = require('../utils/observer');

const buttons = new HashMap();

function createObserver() {
  observer.create('#ghx-detail-view, #issue-content')
    .onAdded(createButton)
    .onRemoved(removeButton)
    .start();
}

function createButton(node) {
  const state = new ButtonState({
    task: {},
    link: null,
    anchor: 'screen'
  });

  const titleObserver = observer
    .create('#summary-val', node)
    .onAdded(function(titleEl) {
      const name = titleEl.innerText;
      state.task.name = name;

      const link = document.querySelector('#key-val, #issuekey-val a').href;
      state.task.notes = 'Added from JIRA: ' + link;
      state.link = link;

      const buttonEl = state.button.render().el;
      titleEl.appendChild(buttonEl);
    })
    .start();

  buttons.set(node, {
    state,
    title: titleObserver,
  });
}

function removeButton(node) {
  const button = buttons.get(node);

  if (button) {
    button.state.remove();
    button.title.stop();
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
