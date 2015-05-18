var api = require ('../api/api');
var ContainerView = require('./container_view/container_view');

exports.initialize = function() {
  return api.auth.load();
};

exports.render = function() {
  var container = new ContainerView();
  return container.render().el;
};
