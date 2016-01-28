var HashMap = require('hashmap');
var offset = require('document-offset');
var ButtonState = require('../button/button.js');
var observer = require('../utils/observer');

var buttons = new HashMap();

function createObserver() {
  observer.create('.issue-header-content')
    .onAdded(createButton)
    .onRemoved(removeButton)
    .start();
}

function createButton(node) {
  var titleEl = node.querySelector('h1');
  var linkEl = node.querySelector('.issue-link');

  var name = titleEl.innerText;
  var link = linkEl.href;

  var state = new ButtonState({
    link: link,
    task: { name: name },
    anchor: 'element'
  });

  var buttonEl = state.button.render().el;
  titleEl.appendChild(buttonEl);

  buttons.set(node, state);
}

function removeButton(node) {
  var button = buttons.get(node);
  if (button != null) button.remove();
}

function handleError(error) {
  console.error(error);
}

if (!ButtonState.isLoaded()) {
  ButtonState.initialize()
    .then(createObserver)
    .catch(handleError);
}
