const View = require('ampersand-view');
const api = require('../api/api');
const CustomDomainsView = require('./custom_domains/custom_domains');

const OptionsView = View.extend({
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

  render() {
    this.renderWithTemplate({
      isAuthenticated: api.auth.authenticated
    });

    return this;
  },

  onLogout() {
    api.auth.revoke().then(() => this.render());
  }
});

module.exports = OptionsView;
