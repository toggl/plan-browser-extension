var HashMap = require('hashmap');
var offset = require('document-offset');
var ButtonState = require('../button/button.js');
var observer = require('../utils/observer');

var buttons = new HashMap();

function createObserver() {
  observer.create('.card-detail-window')
    .onAdded(createButton)
    .onRemoved(removeButton)
    .start();
}

function createButton(node) {
  var titleEl = node.querySelector('.window-title');
  var currentListEl = node.querySelector('.js-current-list');
  var overlayEl = document.querySelector('.window-overlay');

  var name = titleEl.querySelector('.window-title-text').innerText;

  var state = new ButtonState({
    task: { name: name }
  });

  var buttonEl = state.button.render().el;
  titleEl.insertBefore(buttonEl, currentListEl.nextSibling);

  state.on('popup:created', function() {
    var popupEl = state.popup.render().el;
    var buttonOffset = offset(buttonEl);

    popupEl.style.position = 'absolute';
    popupEl.style.left = (buttonOffset.left) + 'px';
    popupEl.style.top = (buttonOffset.top + overlayEl.scrollTop) + 'px';

    overlayEl.appendChild(popupEl);
  });

  buttons.set(node, state);
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
