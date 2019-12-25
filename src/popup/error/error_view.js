import View from 'ampersand-view';
import template from './error_view.hbs';

const ErrorView = View.extend({
  template,

  props: {
    hub: 'object',
    error: 'object',
  },

  events: {
    'click [data-hook=button-back]': 'onBack',
  },

  messages: {
    unknown_error: {
      message: 'Ouch, something went wrong.',
      contact_us: true,
    },
    network_error: {
      message: 'Sorry, it looks like something is wrong with your connection.',
      contact_us: false,
    },
    invalid_credentials: {
      message: 'Sorry, the credentials you have provided are not valid.',
      contact_us: false,
    },
    refresh_denied: {
      message: 'Ouch, something went wrong. Please try logging in again.',
      contact_us: false,
    },
    default: {
      message:
        'Something went horribly wrong, you should not even see this message',
      contact_us: true,
    },
  },

  render() {
    const code = this.error.message;

    const data = this.messages[code]
      ? this.messages[code]
      : this.messages.default;

    this.renderWithTemplate(data);

    return this;
  },

  onBack(event) {
    event.preventDefault();
    this.hub.trigger('error:hide');
  },
});

export default ErrorView;
