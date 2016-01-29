var View = require('ampersand-view');

var ButtonView = View.extend({

  template: require('./button_view.hbs'),

  props: {
    hub: 'state'
  },

  events: {
    'click': 'onClick'
  },

  render: function() {
    this.renderWithTemplate();
    return this;
  },

  onClick: function(event) {
    event.preventDefault();
    this.hub.trigger('button:clicked', event);
  }

});

module.exports = ButtonView;
