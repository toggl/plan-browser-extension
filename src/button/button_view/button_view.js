var View = require('ampersand-view');
var StylesheetView = require('../stylesheet_view/stylesheet_view');

var ButtonView = View.extend({

  template: require('./button_view.dom'),
  stylesheet: require('./button_view.css'),

  events: {
    'click': 'onClick'
  },

  render: function() {
    this.renderWithTemplate();

    var stylesheet = new StylesheetView({stylesheet: this.stylesheet});
    this.renderSubview(stylesheet);
    
    return this;
  },

  onClick: function(event) {
    event.preventDefault();
    this.trigger('click');
  }

});

module.exports = ButtonView;
