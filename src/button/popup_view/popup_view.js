var View = require('ampersand-view');
var StylesheetView = require('../stylesheet_view/stylesheet_view');

var PopupView = View.extend({

  template: require('./popup_view.dom'),
  stylesheet: require('./popup_view.css'),

  render: function() {
    this.renderWithTemplate(this);

    var stylesheet = new StylesheetView({stylesheet: this.stylesheet});
    this.renderSubview(stylesheet);

    return this;
  }

});

module.exports = PopupView;
