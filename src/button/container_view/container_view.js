var View = require('ampersand-view');
var ButtonView = require('../button_view/button_view');
var PopupView = require('../popup_view/popup_view');

var ContainerView = View.extend({

  template: require('./container_view.html'),

  render: function() {
    this.renderWithTemplate();
    this.shadow = this.el.createShadowRoot();

    var button = new ButtonView();
    this.renderSubview(button, this.shadow);
    this.listenTo(button, 'click', this.showPopup);

    return this;
  },

  showPopup: function() {
    var popup = new PopupView();
    this.renderSubview(popup, this.shadow);
  }

});

module.exports = ContainerView;
