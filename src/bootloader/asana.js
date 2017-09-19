var domify = require('domify');
var moment = require('moment');
var HashMap = require('hashmap');
var offset = require('document-offset');
var ButtonState = require('../button/button');
var observer = require('../utils/observer');

var buttons = new HashMap();

function createObserver() {
  observer.create('#right_pane_container')
    .onAdded(createButton)
    .onRemoved(removeButton)
    .start();
}

function createButton(element) {
  var state = new ButtonState({
    task: {
      notes: 'Added from Asana: ' + location.href
    },
    link: location.href,
    anchor: 'screen'
  });

  var titleObserver = observer
    .create('.SingleTaskTitleRow-taskName textarea', element)
    .onAdded(function(titleEl) {
      var name = titleEl.value;
      state.task.name = name;
    })
    .start();

  var actionsObserver = observer
    .create('.SingleTaskPaneToolbar', element)
    .onAdded(function(actionsEl) {
      var itemEl = domify('<div class="circularButtonView circularButtonView--default circularButtonView--onWhiteBackground circularButtonView--active SingleTaskPaneToolbar-button"></div>');
      var buttonEl = state.button.render().el;

      itemEl.appendChild(buttonEl);
      actionsEl.insertBefore(itemEl, actionsEl.children[2]);
    })
    .start();

  buttons.set(element, {
    state: state,
    title: titleObserver,
    actions: actionsObserver
  });
}

function removeButton(node) {
  var button = buttons.get(node);

  if (button != null) {
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
