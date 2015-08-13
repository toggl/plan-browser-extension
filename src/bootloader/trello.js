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
    var position = getPosition(overlayEl, buttonEl);

    if (position.direction != null)
      state.popup.content.direction = position.direction;

    popupEl.style.position = 'absolute';
    popupEl.style.top = position.top + 'px';

    if (position.left != null)
      popupEl.style.left = position.left + 'px';

    if (position.right != null)
      popupEl.style.right = position.right + 'px';
    
    overlayEl.appendChild(popupEl);
  });

  buttons.set(node, state);
}

function getPosition(overlayEl, buttonEl) {
  var buttonOffset = offset(buttonEl);

  if (buttonOffset.left < overlayEl.offsetWidth / 2) {
    return {
      direction: 'right',
      left: buttonOffset.left,
      top: buttonOffset.top + overlayEl.scrollTop
    };
  } else {
    return {
      direction: 'left',
      right: overlayEl.offsetWidth - buttonOffset.left - buttonEl.offsetWidth,
      top: buttonOffset.top + overlayEl.scrollTop
    };
  }
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
