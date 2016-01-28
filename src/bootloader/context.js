var offset = require('document-offset');
var ButtonState = require('../button/button');
 
function createButton() {
  var selection = window.getSelection();
  var range = selection.getRangeAt(0);
  var title = range.toString();
  
  var state = new ButtonState({
    task: { name: title },
    anchor: 'screen'
  });

  state.createPopup();
}
 
function handleError(error) {
  console.error(error);
}
 
ButtonState.initialize()
  .then(createButton)
  .catch(handleError);
