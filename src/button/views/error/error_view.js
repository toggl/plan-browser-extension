var View = require('ampersand-view');

var ErrorView = View.extend({

  template: require('./error_view.hbs'),

  props: {
    hub: 'state',
    error: 'any'
  },

  events: {
    'click [data-hook=button-dismiss]': 'onDismiss'
  },

  render: function() {
    this.renderWithTemplate(this.error);
    return this;
  },

  onDismiss: function(event) {
    event.preventDefault();
    this.hub.trigger('error:hide');
  }

});

module.exports = ErrorView;
