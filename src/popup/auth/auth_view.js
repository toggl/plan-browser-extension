var View = require('ampersand-view');
var api = require('../../api/api');

var FormErrors = require('../form/form_errors');
var TextField = require('../fields/text_field');
var EmailField = require('../fields/email_field');

var AuthView = View.extend({

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

  render: function() {
    this.renderWithTemplate(this);
    return this;
  },

  onSubmit: function(event) {
    event.preventDefault();
    event.stopPropagation();

    if (!this.validate()) return;

    var credentials = {
      username: this.email.value,
      password: this.password.value
    };

    var hub = this.hub;
    hub.trigger('loader:show');

    api.auth.authenticate(credentials).then(function() {
      hub.trigger('loader:hide');
      hub.trigger('popup:update');
    }, function(error) {
      hub.trigger('loader:hide');
      hub.trigger('error:show', error);
    });
  },

  onCancel: function(event) {
    event.preventDefault();
    event.stopPropagation();
    
    this.hub.trigger('popup:close');
  },

  validate: function() {
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
