var HashMap = require('hashmap');
var offset = require('document-offset');
var ButtonState = require('../button/button');
var observer = require('../utils/observer');

var buttons = new HashMap();
 
function createObserver() {
  observer.create('.milestone')
    .onAdded(createButton)
    .onRemoved(removeButton)
    .start();
}

function createButton(milestone) {
  var title = milestone.querySelector('h4');
  var name = title.querySelector('a').innerText;
  
  var state = new ButtonState({
    task: { name: name }
  });

  var buttonEl = state.button.render().el;
  title.appendChild(buttonEl);

  state.on('popup:created', function() {
    var popupEl = state.popup.render().el;
    var position = offset(buttonEl);

    popupEl.style.position = 'absolute';
    popupEl.style.left = position.left + 'px';
    popupEl.style.top = position.top + 'px';

    document.body.appendChild(popupEl);
  });

  buttons.set(title, state);
}

function removeButton(node) {
  var button = buttons.get(node);
  if (button != null) button.remove();
}
 
function handleError(error) {
  console.error(error);
}
 
ButtonState.initialize()
  .then(createObserver)
  .catch(handleError);
