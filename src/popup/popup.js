var qs = require('querystring');
var Promise = require('promise');
var Events = require('ampersand-events');
var PopupView = require('./popup/popup_view');
var api = require('../api/api');
var TaskModel = require('../models/task_model');
var collections = require('../models/collections');

function parseQuery() {
  var query = location.search.substr(1);
  return qs.parse(query);
}

function createTask(query) {
  return new TaskModel({
    name: query.name,
    start_date: query.start_date,
    end_date: query.end_date
  }, {parse: true});
}

function createHub() {
  return Events.createEmitter()
}

function createView() {
  var query = parseQuery();

  return new PopupView({
    hub: createHub(),
    task: createTask(query),
    link: query.link
  });
}

function renderView(view) {
  view.render();
  document.body.appendChild(view.el);
}

function initialize() {
  return Promise.all([
    api.auth.load(),
    collections.taskSources.fetch()
  ]);
}

initialize().then(function() {
  var view = createView();
  renderView(view);  
});
