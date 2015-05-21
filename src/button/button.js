var api = require ('./api/api');
var ContainerView = require('./views/container/container_view');
var TaskModel = require('./models/task_model');

exports.initialize = function() {
  return api.auth.load();
};

exports.create = function(attributes) {
  var task = new TaskModel(attributes);
  var container = new ContainerView({ task: task });
  return container.render().el;
};
