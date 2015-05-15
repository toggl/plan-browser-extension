var View = require('ampersand-view');

var ButtonView = View.extend({

  template: require('./button_view.hbs'),

  events: {
    'click': 'onClick'
  },

  render: function() {
    this.renderWithTemplate();
    return this;
  },

  onClick: function(event) {
    event.preventDefault();
    this.trigger('click');
  }

});

module.exports = ButtonView;
