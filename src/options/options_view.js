import View from 'ampersand-view';
import * as api from '../api/api';
import CustomDomainsView from './custom_domains/custom_domains';
import template from './options_view.hbs';

const OptionsView = View.extend({
  template,

  events: {
    'click [data-hook=button-logout]': 'onLogout',
  },

  subviews: {
    domains: {
      hook: 'subview-domains',
      constructor: CustomDomainsView,
    },
  },

  render() {
    this.renderWithTemplate({
      isAuthenticated: api.auth.authenticated,
    });

    return this;
  },

  onLogout() {
    api.auth.revoke().then(() => this.render());
  },
});

export default OptionsView;
