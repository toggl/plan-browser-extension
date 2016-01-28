var qs = require('querystring');
var Events = require('ampersand-events');
var PopupView = require('./popup/popup_view');
var api = require('../api/api');
var TaskModel = require('../models/task_model');

function createTask() {
  var query = location.search.substr(1);
  var attrs = qs.parse(query);

  return new TaskModel(attrs, {parse: true});
}

function createHub() {
  return Events.createEmitter()
}

function createView() {
  return new PopupView({
    hub: createHub(),
    task: createTask()
  });
}

function renderView(view) {
  view.render();
  document.body.appendChild(view.el);
}

api.auth.load().then(function() {
  var view = createView();
  renderView(view);  
});
