var HashMap = require('hashmap');
var ButtonState = require('../button/button');
var observer = require('../utils/observer');

var buttons = new HashMap();
 
function createObserver() {
  observer.create('#issue-view')
    .onAdded(createButton)
    .onRemoved(removeButton)
    .start();
}

function createButton(element) {
  var titleEl = element.querySelector('#issue-title');

  var name = titleEl.innerText;
  var link = location.href;
  
  var state = new ButtonState({
    task: {name: name},
    link: link,
    anchor: 'screen'
  });

  var buttonEl = state.button.render().el;
  titleEl.appendChild(buttonEl);

  buttons.set(element, state);
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
