var ContainerView = require('./container_view/container_view');

exports.render = function() {
  var container = new ContainerView();
  return container.render().el;
};
