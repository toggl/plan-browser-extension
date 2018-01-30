const domify = require('domify');
const HashMap = require('hashmap');
const ButtonState = require('../button/button');
const observer = require('../utils/observer');

const buttons = new HashMap();

function createObserver() {
  observer.create('#right_pane_container')
    .onAdded(createButton)
    .onRemoved(removeButton)
    .start();
}

function createButton(element) {
  const state = new ButtonState({
    task: {
      notes: 'Added from Asana: ' + location.href
    },
    link: location.href,
    anchor: 'screen'
  });

  const titleObserver = observer
    .create('.SingleTaskTitleRow-taskName textarea', element)
    .onAdded(function(titleEl) {
      const name = titleEl.value;
      state.task.name = name;
    })
    .start();

  const actionsObserver = observer
    .create('.SingleTaskPaneToolbar', element)
    .onAdded(function(actionsEl) {
      const itemEl = domify('<div class="circularButtonView circularButtonView--default circularButtonView--onWhiteBackground circularButtonView--active SingleTaskPaneToolbar-button"></div>');
      const buttonEl = state.button.render().el;

      itemEl.appendChild(buttonEl);
      actionsEl.insertBefore(itemEl, actionsEl.children[2]);
    })
    .start();

  buttons.set(element, {
    state,
    title: titleObserver,
    actions: actionsObserver
  });
}

function removeButton(node) {
  const button = buttons.get(node);

  if (button) {
    button.state.remove();
    button.title.stop();
    button.actions.stop();
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
