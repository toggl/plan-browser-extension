var View = require('ampersand-view');

var ErrorView = View.extend({

  template: require('./error_view.hbs'),

  props: {
    hub: 'state',
    error: 'object'
  },

  events: {
    'click [data-hook=button-dismiss]': 'onDismiss'
  },

  messages: {
    unknown_error: {
      message: 'Ouch, something went wrong.',
      contact_us: true
    },
    network_error: {
      message: 'Sorry, it looks like something is wrong with the connection.',
      contact_us: false,
    },
    authentication_failed: {
      message: 'Sorry, authentication has failed.',
      contact_us: true,
    },
    invalid_credentials: {
      message: 'Sorry, the credentials you have provided are not valid.',
      contact_us: false
    },
    refresh_denied: {
      message: 'Ouch, something went wrong. Please try logging in again.',
      contact_us: false
    },
    default: {
      message: 'Something went horribly wrong, you should not even see this message',
      contact_us: true
    }
  },

  render: function() {
    var code = this.error.message;

    var data = this.messages[code] != null ?
      this.messages[code] :
      this.messages.default;

    this.renderWithTemplate(data);

    return this;
  },

  onDismiss: function(event) {
    event.preventDefault();
    this.hub.trigger('error:hide');
  }

});

module.exports = ErrorView;
