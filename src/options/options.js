var OptionsView = require('./options_view.js');
var api = require('../api/api');

function initialize() {
  return api.auth.load();
}

function render() {
  var options = new OptionsView().render();
  document.body.appendChild(options.el);
}

function handleError(error) {
  console.error(error);
}

initialize()
  .then(render)
  .catch(handleError);
