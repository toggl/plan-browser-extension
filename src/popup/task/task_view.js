import moment from 'moment';
import View from 'ampersand-view';
import { sleep } from 'src/utils';
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
      prepareView() {
        return new AccountField({
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
    this.showLoader();

    try {
      this.me = await fetchMe();
      this.hideLoader();
      this.me.workspaces.map(workspace => accounts.add(workspace));

      this.accountSwitcher.switchAccount(
        accounts.get(this.me.preferences.selected_account_id)
      );
    } catch (error) {
      console.log(error);
      this.hideLoader();
      this.hub.trigger('error:show', error);
    }
  },

  render() {
    this.renderWithTemplate(this);
    this.listenTo(
      this.accountSwitcher,
      'change:selectedAccountId',
      this.onAccountSelected
    );
    return this;
  },

  async onAccountSelected() {
    this.showLoader();

    const account = accounts.get(this.accountSwitcher.selectedAccountId);
    await account.projects.fetch();
    await account.users.fetch();
    await account.colors.updateRules();
    this.workspace = account;

    if (this.content) {
      this.content.remove();
    }
    this.content = new Content({
      workspace: this.workspace,
      me: this.me,
      task: this.model,
      enableEdit: !this.accountIsReadonly,
    });
    this.renderSubview(this.content, this.queryByHook('content'));

    this.hideLoader();
  },

  async onSubmit(event) {
    event.preventDefault();
    event.stopPropagation();

    if (!this.validate()) {
      return;
    }

    this.workspace.tasks.add(this.model);

    // save
    try {
      this.showLoader();
      await this.model.save();
      this.hub.trigger('task:created', this.model, this.workspace);
      this.hideLoader();
      await this.showOverlay();
      this.closePopup();
    } catch (error) {
      this.hideLoader();
      this.showError(error);
    }
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
    const {
      content: { task },
      errors,
    } = this;

    errors.clearErrors();

    task.name = (task.name || '').trim();
    if (!task.name) {
      errors.addError('Task name cannot be empty');
      return false;
    }

    if (!(task.workspace_members.length || task.project_id)) {
      errors.addError('Set assignee(s) or project');
      return false;
    }

    if (task.workspace_members.length) {
      if (!task.start_date) {
        errors.addError('Start date cannot be empty');
        return false;
      }

      if (!task.end_date) {
        errors.addError('End date cannot be empty');
        return false;
      }

      if (moment(task.end_date).isBefore(task.start_date, 'day')) {
        errors.addError('End date cannot be before start date');
        return false;
      }
    }

    return true;
  },

  showLoader() {
    this.hub.trigger('loader:show');
  },

  hideLoader() {
    this.hub.trigger('loader:hide');
  },

  async showOverlay() {
    this.overlay = true;
    await sleep(2000);
  },

  closePopup() {
    this.hub.trigger('popup:close');
  },

  showError(error) {
    this.hub.trigger('error:show', error);
  },
});

export default TaskView;
