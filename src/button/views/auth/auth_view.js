var View = require('ampersand-view');
var api = require('../../../api/api');

var FormMixin = require('../form/form_mixin');
var TextField = require('../fields/text_field');
var EmailField = require('../fields/email_field');

var AuthView = View.extend(FormMixin, {

  template: require('./auth_view.hbs'),

  props: {
    hub: 'state'
  },

  subviews: {
    email: { hook: 'input-email', constructor: EmailField },
    password: { hook: 'input-password', constructor: TextField },
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
      hub.trigger('popup:show:task');
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
    var valid = true;

    this.clearErrors();

    if (!this.email.isFilled) {
      this.addError('email', 'E-mail cannot be empty');
      valid = false;
    }

    if (!this.email.isEmail) {
      this.addError('email', 'E-mail is invalid');
      valid = false;
    }

    if (!this.password.isFilled) {
      this.addError('password', 'Password cannot be empty');
      valid = false;
    }

    return valid;
  }

});

module.exports = AuthView;
