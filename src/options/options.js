import OptionsView from './options_view.js';
import * as api from '../api/api';

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
