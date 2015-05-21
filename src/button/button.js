var api = require ('./api/api');
var ContainerView = require('./views/container/container_view');

exports.initialize = function() {
  return api.auth.load();
};

exports.render = function() {
  var container = new ContainerView();
  return container.render().el;
};
