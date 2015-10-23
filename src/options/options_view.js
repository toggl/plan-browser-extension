var View = require('ampersand-view');
var api = require('../api/api');
var CustomDomainsView = require('./custom_domains/custom_domains');

var OptionsView = View.extend({

  template: require('./options_view.hbs'),

  events: {
    'click [data-hook=button-logout]': 'onLogout'
  },

  subviews: {
    domains: {
      hook: 'subview-domains',
      constructor: CustomDomainsView
    }
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