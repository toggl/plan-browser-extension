import View from 'ampersand-view';
import * as api from '../../api/api';
import template from './auth_view.hbs';

const AuthView = View.extend({
  template,

  props: {
    hub: 'object',
  },

  events: {
    'click [data-hook=button-signin]': 'onSignin',
    'click [data-hook=button-signup]': 'onSignup',
  },

  render() {
    this.renderWithTemplate(this);
    return this;
  },

  onSignin() {
    console.log('onSignin');
    api.auth.launchSharedAuthFlow('signin');
  },

  onSignup() {
    console.log('onSignup');
    api.auth.launchSharedAuthFlow('signup');
  },
});

export default AuthView;
