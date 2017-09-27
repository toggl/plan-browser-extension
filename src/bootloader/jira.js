var HashMap = require('hashmap');
var offset = require('document-offset');
var ButtonState = require('../button/button.js');
var observer = require('../utils/observer');

var buttons = new HashMap();

function createObserver() {
  observer.create('#ghx-detail-view, #issue-content')
    .onAdded(createButton)
    .onRemoved(removeButton)
    .start();
}

function createButton(node) {
  var state = new ButtonState({
    task: {},
    link: null,
    anchor: 'screen'
  });

  var titleObserver = observer
    .create('#summary-val', node)
    .onAdded(function(titleEl) {
      var name = titleEl.innerText;
      state.task.name = name;

      var link = document.querySelector('#key-val, #issuekey-val a').href;
      state.task.notes = 'Added from JIRA: ' + link;
      state.link = link;

      var buttonEl = state.button.render().el;
      titleEl.appendChild(buttonEl);
    })
    .start();

  buttons.set(node, {
    state: state,
    title: titleObserver,
  });
}

function removeButton(node) {
  var button = buttons.get(node);

  if (button != null) {
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
