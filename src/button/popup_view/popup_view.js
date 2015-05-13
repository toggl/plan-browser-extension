var View = require('ampersand-view');

var PopupView = View.extend({

  template: require('./popup_view.dom'),

  render: function() {
    this.renderWithTemplate(this);
    return this;
  }

});

module.exports = PopupView;
