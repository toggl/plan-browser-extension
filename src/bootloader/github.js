var offset = require('document-offset');
var ButtonState = require('../button/button');
var observer = require('../utils/observer');
 
function createButtons() {
  observer.create('.milestone-title-link', function(title) {
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
  });
}
 
function handleError(error) {
  console.error(error);
}
 
ButtonState.initialize()
  .then(createButtons)
  .catch(handleError);