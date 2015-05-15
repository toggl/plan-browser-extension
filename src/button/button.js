var api = require ('../api/api');
var ContainerView = require('./container_view/container_view');

exports.initialize = function() {
  return api.initialize();
};

exports.render = function() {
  var container = new ContainerView();
  return container.render().el;
};
