import Promise from 'bluebird';
import moment from 'moment';
import View from 'ampersand-view';
import AccountField from './account_field/account_field';
import FormErrors from '../form/form_errors';
import accounts from 'src/models/account_collection';
import fetchMe from '../../utils/me';
import Content from './content/content';
import './task_view.scss';
import css from './task_view.module.scss';
import template from './task_view.dot';

const TaskView = View.extend({
  template,
  css,

  props: {
    hub: 'object',
    overlay: 'boolean',
    workspace: 'state',
    me: 'object',
    model: 'state',
  },

  subviews: {
    errors: { hook: 'errors', constructor: FormErrors },

    accountSwitcher: {
      hook: 'select-account',
      prepareView(el) {
        return new AccountField({
          el,
          parent: this,
          selectOpts: {},
        });
      },
    },
  },

  events: {
    'submit [data-hook=form]': 'onSubmit',
    'click [data-hook=button-cancel]': 'onCancel',
  },

  derived: {
    accountIsReadonly: {
      deps: ['workspace.id', 'me.id'],
      fn() {
        if (!(this.workspace && this.me)) {
          return false;
        }

        const { id } = this.me;
        const { role } = this.workspace.users.get(id);
        return role === 'readonly';
      },
    },
  },

  bindings: {
    overlay: {
      type: 'booleanClass',
      hook: 'done-overlay',
      yes: 'task-popup__overlay--visible',
      no: 'task-popup__overlay--hidden',
    },
    accountIsReadonly: [
      {
        type: 'booleanClass',
        yes: 'task-popup--disabled',
      },
      {
        type: 'booleanAttribute',
        selector: '.button--submit',
        name: 'disabled',
      },
      {
        type: 'toggle',
        hook: 'readonly-label',
      },
    ],
  },

  async initialize() {
    try {
      this.hub.trigger('loader:show');

      this.me = await fetchMe();
      this.me.workspaces.map(workspace => accounts.add(workspace));

      this.accountSwitcher.switchAccount(
        accounts.get(this.me.preferences.selected_account_id)
      );

      this.hub.trigger('loader:hide');
    } catch (error) {
      console.log(error);
      this.hub.trigger('loader:hide');
      this.hub.trigger('error:show', error);
    }
  },

  render() {
    this.renderWithTemplate(this);
    this.listenTo(this.accountSwitcher, 'change:value', this.onAccountSelected);
    return this;
  },

  async onAccountSelected() {
    const account = accounts.get(this.accountSwitcher.value);
    await account.projects.fetch();
    await account.users.fetch();
    await account.colors.updateRules();
    this.workspace = account;

    this.content = new Content({
      workspace: this.workspace,
      me: this.me,
      enableEdit: true,
      task: this.model,
    });
    this.renderSubview(this.content, this.queryByHook('content'));

    // this.user.switchAccount(this.workspace);
  },

  onSubmit(event) {
    event.preventDefault();
    event.stopPropagation();

    if (!this.validate()) {
      return;
    }

    this.workspace.tasks.add(this.model);

    // default task color
    if (!this.project.value) {
      this.model.set({
        color: 21,
      });
    }

    // save
    this.showLoader();

    this.model.save().then(
      () => {
        this.hub.trigger('task:created', this.model, this.workspace);

        this.hideLoader();
        this.showOverlay().then(() => this.closePopup());
      },
      error => {
        this.hideLoader();
        this.showError(error);
      }
    );
  },

  onCancel(event) {
    event.preventDefault();
    event.stopPropagation();
    this.hub.trigger('popup:close');
  },

  hideErrors() {
    this.errors.clearErrors();
  },

  validate() {
    this.errors.clearErrors();

    if (!this.name.isFilled) {
      this.errors.addError('Task name cannot be empty');
      return false;
    }

    if (!this.user.isFilled) {
      this.errors.addError('User cannot be empty');
      return false;
    }

    if (this.user.hasUser) {
      if (!this.start_date.isFilled) {
        this.errors.addError('Start date cannot be empty');
        return false;
      }

      if (!this.end_date.isFilled) {
        this.errors.addError('End date cannot be empty');
        return false;
      }

      if (moment(this.end_date.value).isBefore(this.start_date.value, 'day')) {
        this.errors.addError('End date cannot be before start date');
        return false;
      }
    }

    return true;
  },

  focusNameField() {
    this.name.focus();
  },

  showLoader() {
    this.hub.trigger('loader:show');
  },

  hideLoader() {
    this.hub.trigger('loader:hide');
  },

  showOverlay() {
    return new Promise(resolve => {
      this.overlay = true;
      setTimeout(resolve, 2000);
    });
  },

  closePopup() {
    this.hub.trigger('popup:close');
  },

  showError(error) {
    this.hub.trigger('error:show', error);
  },
});

export default TaskView;
