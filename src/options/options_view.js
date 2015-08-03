var View = require('ampersand-view');
var api = require('../button/api/api');

var OptionsView = View.extend({

  template: require('./options_view.hbs'),

  events: {
    'click [data-hook=button-logout]': 'onLogout'
  },
  
  render: function() {
    this.renderWithTemplate({
      isAuthenticated: api.auth.authenticated
    });
    
    return this;
  },

  onLogout: function(event) {
    var self = this;

    api.auth.revoke()
      .then(function() {
        self.render();
      });
  }

});

module.exports = OptionsView;