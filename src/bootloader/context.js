var offset = require('document-offset');
var ButtonState = require('../button/button');
 
function createObserver() {
  var selection = window.getSelection();
  createButton(selection);
}

function createButton(selection) {
  var range = selection.getRangeAt(0);
  var title = range.toString();
  
  var state = new ButtonState({
    task: { name: title }
  });

  state.on('popup:created', function() {
    var popupEl = state.popup.render().el;
    var position = offset(range);

    popupEl.style.position = 'absolute';
    popupEl.style.left = position.left + 'px';
    popupEl.style.top = position.top + 'px';

    document.body.appendChild(popupEl);
  });

  state.createPopup();
}
 
function handleError(error) {
  console.error(error);
}
 
ButtonState.initialize()
  .then(createObserver)
  .catch(handleError);
