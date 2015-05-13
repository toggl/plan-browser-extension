var View = require('ampersand-view');
var ButtonView = require('../button_view/button_view');
var PopupView = require('../popup_view/popup_view');

var ContainerView = View.extend({

  template: require('./container_view.dom'),

  render: function() {
    this.renderWithTemplate();

    var button = new ButtonView();
    this.listenTo(button, 'click', this.showPopup);
    this.renderSubview(button);

    return this;
  },

  showPopup: function() {
    var popup = new PopupView();
    this.renderSubview(popup);
  }

});

module.exports = ContainerView;
