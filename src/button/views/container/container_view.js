var View = require('ampersand-view');
var api = require('../../api/api');
var ButtonView = require('../button/button_view');
var PopupView = require('../popup/popup_view');

var ContainerView = View.extend({

  template: require('./container_view.hbs'),

  render: function() {
    this.renderWithTemplate();

    var button = new ButtonView();
    this.listenTo(button, 'click', this.showPopup);
    this.renderSubview(button);

    this.showPopup();

    return this;
  },

  showPopup: function() {
    var popup = new PopupView();
    this.renderSubview(popup);
  }

});

module.exports = ContainerView;
