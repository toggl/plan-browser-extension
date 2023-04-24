import Promise from 'bluebird';
import View from 'ampersand-view';
import * as api from '../../api/api';
import FormErrors from '../form/form_errors';
import TextField from '../fields/input';
import { clear as clearMe } from '../../utils/me';
import { triggerAchievementUseButton } from 'src/api/stash';
import template from './auth_view.hbs';

const AuthView = View.extend({
  template,

  props: {
    hub: 'object',
  },

  subviews: {
    email: {
      hook: 'input-email',
      prepareView() {
        return new TextField({
          name: 'email',
          label: 'Email',
          placeholder: 'Type here...',
          value: '',
          tabIndex: 1,
          validations: [
            {
              run: (value) => value.length > 0,
              message: '*Email cannot be empty',
            },
          ],
        });
      },
    },
    password: {
      hook: 'input-password',
      prepareView() {
        return new TextField({
          name: 'password',
          label: 'Password',
          placeholder: 'Type here...',
          value: '',
          type: 'password',
          tabIndex: 2,
          validations: [
            {
              run: (value) => value.length > 0,
              message: '*Password cannot be empty',
            },
          ],
        });
      },
    },
    errors: { hook: 'errors', constructor: FormErrors },
  },

  events: {
    'click [data-hook=button-signin]': 'onSignin',
    'submit [data-hook=form]': 'onSubmit',
    'click [data-hook=button-cancel]': 'onCancel',
  },

  render() {
    this.renderWithTemplate(this);
    return this;
  },

  onSignin() {
    console.log('onSignin');
    api.auth.launchSharedAuthFlow();
  },

  onSubmit(event) {
    event.preventDefault();
    event.stopPropagation();

    if (!this.validate()) {
      return;
    }

    const credentials = {
      username: this.email.value,
      password: this.password.value,
    };

    const hub = this.hub;
    hub.trigger('loader:show');

    Promise.all([
      clearMe(),
      api.auth.authenticate(credentials).then(
        function () {
          hub.trigger('loader:hide');
          triggerAchievementUseButton();
          hub.trigger('popup:update');
          return null;
        },
        function (error) {
          hub.trigger('loader:hide');
          hub.trigger('error:show', error);
        }
      ),
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
  },
});

export default AuthView;
