var HashMap = require('hashmap');
var ButtonState = require('../button/button');
var observer = require('../utils/observer');

var buttons = new HashMap();
 
function createObserver() {
  observer.create('.issue-title-link')
    .onAdded(createButton)
    .onRemoved(removeButton)
    .start();
}

function createButton(title) {
  var name = title.innerText;
  var link = title.href;
  
  var state = new ButtonState({
    link: link,
    task: {
      name: name,
      notes: 'Added from GitHub: ' + link
    },
    anchor: 'element'
  });

  var buttonEl = state.button.render().el;
  title.appendChild(buttonEl);

  buttons.set(title, state);
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
