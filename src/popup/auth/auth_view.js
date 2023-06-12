import View from 'ampersand-view';
import * as api from '../../api/api';
import template from './auth_view.hbs';
import { triggerAchievementUseButton } from 'src/api/stash';

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
    this.hub.trigger('loader:show');
    api.auth
      .launchSharedAuthFlow('signin')
      .then((res) => {
        console.log(res);
        this.handleAuthenticationSuccess();
      })
      .catch((err) => {
        this.handleAuthenticationFailure(err);
      });
  },

  onSignup() {
    console.log('onSignup');
    this.hub.trigger('loader:show');
    api.auth
      .launchSharedAuthFlow('signup')
      .then((res) => {
        console.log(res);
        this.handleAuthenticationSuccess();
      })
      .catch((err) => {
        this.handleAuthenticationFailure(err);
      });
  },

  handleAuthenticationSuccess() {
    this.hub.trigger('loader:hide');
    triggerAchievementUseButton();
    this.hub.trigger('popup:update');
  },

  handleAuthenticationFailure(err) {
    this.hub.trigger('loader:hide');
    this.hub.trigger('error:show', err);
  },
});

export default AuthView;
