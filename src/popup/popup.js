const qs = require('querystring');
const Promise = require('promise');
const Events = require('ampersand-events');
const PopupView = require('./popup/popup_view');
const api = require('../api/api');
const TaskModel = require('../models/task_model');
const collections = require('../models/collections');
require('./utils/handlebars_helpers');

function parseQuery() {
  const query = location.search.substr(1);
  return qs.parse(query);
}

function createTask(query) {
  return new TaskModel(
    {
      name: query.name || '',
      start_date: query.start_date,
      end_date: query.end_date,
      start_time: query.start_time,
      end_time: query.end_time,
      notes: query.notes
    },
    { parse: true }
  );
}

function createHub() {
  return Events.createEmitter();
}

function createView() {
  const query = parseQuery();

  return new PopupView({
    hub: createHub(),
    task: createTask(query),
    link: query.link
  });
}

function renderView(view) {
  view.render();
  document.body.appendChild(view.el);
  view.resizeWindow();
}

function initialize() {
  return Promise.all([api.auth.load(), collections.taskSources.fetch()]);
}

initialize().then(function() {
  const view = createView();
  renderView(view);
});
