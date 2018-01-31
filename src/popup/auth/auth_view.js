const View = require('ampersand-view');
const api = require('../../api/api');
const FormErrors = require('../form/form_errors');
const TextField = require('../fields/text_field');
const EmailField = require('../fields/email_field');

const AuthView = View.extend({
  template: require('./auth_view.hbs'),

  props: {
    hub: 'object'
  },

  subviews: {
    email: { hook: 'input-email', constructor: EmailField },
    password: { hook: 'input-password', constructor: TextField },
    errors: { hook: 'errors', constructor: FormErrors }
  },

  events: {
    'submit [data-hook=form]': 'onSubmit',
    'click [data-hook=button-cancel]': 'onCancel'
  },

  render() {
    this.renderWithTemplate(this);
    return this;
  },

  onSubmit(event) {
    event.preventDefault();
    event.stopPropagation();

    if (!this.validate()) {
      return;
    }

    const credentials = {
      username: this.email.value,
      password: this.password.value
    };

    const hub = this.hub;
    hub.trigger('loader:show');

    api.auth.authenticate(credentials).then(function() {
      hub.trigger('loader:hide');
      hub.trigger('popup:update');
    }, function(error) {
      hub.trigger('loader:hide');
      hub.trigger('error:show', error);
    });
  },

  onCancel(event) {
    event.preventDefault();
    event.stopPropagation();

    this.hub.trigger('popup:close');
  },

  validate() {
    this.errors.clearErrors();

    if (!this.email.isFilled) {
      this.errors.addError('E-mail cannot be empty');
      return false;
    }

    if (!this.email.isEmail) {
      this.errors.addError('E-mail is invalid');
      return false;
    }

    if (!this.password.isFilled) {
      this.errors.addError('Password cannot be empty');
      return false;
    }

    return true;
  }
});

module.exports = AuthView;
