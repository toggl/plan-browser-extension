var View = require('ampersand-view');
var ButtonView = require('../button_view/button_view');

var ContainerView = View.extend({

  template: require('./container_view.html'),

  render: function() {
    this.renderWithTemplate();
    this.shadow = this.el.createShadowRoot();

    var button = new ButtonView();
    this.renderSubview(button, this.shadow);

    return this;
  }

});

module.exports = ContainerView;
