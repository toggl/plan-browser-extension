var offset = require('document-offset');
var ButtonState = require('../button/button');
 
function createButton() {
  var selection = window.getSelection();
  var range = selection.getRangeAt(0);
  var title = range.toString();
  
  var state = new ButtonState({
    task: { name: title },
    type: 'modal'
  });

  state.on('popup:created', function() {
    var popupEl = state.popup.render().el;
    state.popup.content.direction = 'center';
    document.body.appendChild(popupEl);
  });

  state.createPopup();
}
 
function handleError(error) {
  console.error(error);
}
 
ButtonState.initialize()
  .then(createButton)
  .catch(handleError);
