var View = require('ampersand-view');
var api = require('../../api/api');

var AuthView = View.extend({

  template: require('./auth_view.hbs'),

  events: {
    'click [data-hook=button-sign-in]': 'onSubmit'
  },

  render: function() {
    this.renderWithTemplate(this);
    return this;
  },

  onSubmit: function() {
    var values = {
      username: this.queryByHook('input-email').value,
      password: this.queryByHook('input-password').value
    };

    api.auth.authenticate(values);
  }

});

module.exports = AuthView;
