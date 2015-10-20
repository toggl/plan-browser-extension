var HashMap = require('hashmap');
var offset = require('document-offset');
var ButtonState = require('../button/button.js');
var observer = require('../utils/observer');

var buttons = new HashMap();

function createObserver() {
  observer.create('#issue-content')
    .onAdded(createButton)
    .onRemoved(removeButton)
    .start();
}

function createButton(node) {
  var contentEl = node;
  var titleEl = contentEl.querySelector('#summary-val');
  var name = titleEl.innerText;

  var state = new ButtonState({
    task: { name: name }
  });

  var buttonEl = state.button.render().el;
  titleEl.appendChild(buttonEl);

  state.on('popup:created', function() {
    var popupEl = state.popup.render().el;
    var position = getPosition(contentEl, buttonEl);

    if (position.direction != null)
      state.popup.content.direction = position.direction;

    popupEl.style.position = 'absolute';
    popupEl.style.top = position.top + 'px';

    if (position.left != null)
      popupEl.style.left = position.left + 'px';

    if (position.right != null)
      popupEl.style.right = position.right + 'px';
    
    contentEl.appendChild(popupEl);
  });

  buttons.set(node, state);
}

function getPosition(contentEl, buttonEl) {
  var contentOffset = offset(contentEl);
  var buttonOffset = offset(buttonEl);

  var relativeOffset = {
    left: buttonOffset.left - contentOffset.left,
    top: buttonOffset.top - contentOffset.top
  };

  if (relativeOffset.left < contentEl.offsetWidth / 2) {
    return {
      direction: 'right',
      left: relativeOffset.left,
      top: relativeOffset.top
    };
  } else {
    return {
      direction: 'left',
      right: contentEl.offsetWidth - relativeOffset.left - buttonEl.offsetWidth,
      top: relativeOffset.top
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
