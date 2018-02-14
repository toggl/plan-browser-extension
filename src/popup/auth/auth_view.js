const Promise = require('bluebird');
const View = require('ampersand-view');
const api = require('../../api/api');
const FormErrors = require('../form/form_errors');
const TextField = require('../fields/input');
const {clear: clearMe} = require('../../utils/me');
const {clear: clearPreferences} = require('../../utils/preferences');

const AuthView = View.extend({
  template: require('./auth_view.hbs'),

  props: {
    hub: 'object'
  },

  subviews: {
    email: {
      hook: 'input-email',
      prepareView(el) {
        return new TextField({
          el,
          name: 'email',
          label: 'Email',
          placeholder: 'Type here...',
          value: '',
          tabIndex: 1,
          validations: [{
            run: value => value.length > 0,
            message: '*Email cannot be empty',
          }]
        });
      }
    },
    password: {
      hook: 'input-password',
      prepareView(el) {
        return new TextField({
          el,
          name: 'password',
          label: 'Password',
          placeholder: 'Minimum 8 characters...',
          value: '',
          type: 'password',
          tabIndex: 2,
          validations: [{
            run: value => value.length > 0,
            message: '*Password cannot be empty',
          }]
        });
      }
    },
    errors: { hook: 'errors', constructor: FormErrors }
  },

  events: {
    'submit [data-hook=form]': 'onSubmit',
    'click [data-hook=button-cancel]': 'onCancel'
  },

  render() {
    this.renderWithTemplate(this);
    this.email.focus();
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

    Promise.all([
      clearPreferences(),
      clearMe(),
      api.auth.authenticate(credentials).then(function() {
        hub.trigger('loader:hide');
        hub.trigger('popup:update');
      }, function(error) {
        hub.trigger('loader:hide');
        hub.trigger('error:show', error);
      })
    ]);
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

    if (!this.password.isFilled) {
      this.errors.addError('Password cannot be empty');
      return false;
    }

    return true;
  }
});

module.exports = AuthView;
