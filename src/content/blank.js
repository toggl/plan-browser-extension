var Button = require('../button/button.js');

Button.initialize().then(function() {
  var el = Button.render();
  document.body.appendChild(el);
});
