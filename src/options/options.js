const OptionsView = require('./options_view.js');
const api = require('../api/api');

function initialize() {
  return api.auth.load();
}

function render() {
  const options = new OptionsView().render();
  document.body.appendChild(options.el);
}

function handleError(error) {
  console.error(error);
}

initialize()
  .then(render)
  .catch(handleError);
