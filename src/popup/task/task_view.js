const Promise = require('bluebird');
const moment = require('moment');
const View = require('ampersand-view');
const AccountCollection = require('../../models/account_collection');
const FormErrors = require('../form/form_errors');
const UserField = require('../fields/user_field');
const ProjectField = require('../fields/project_field');
const EstimateField = require('../fields/estimate_field');
const DateField = require('../fields/date_field');
const TimeField = require('../fields/time_field');
const AccountField = require('../fields/account_field');
const fetchMe = require('../../utils/me');
const fetchPreferences = require('../../utils/preferences');
const TextField = require('../fields/input');

const TaskView = View.extend({
  template: require('./task_view.hbs'),

  props: {
    hub: 'object',
    user: 'state',
    project: 'state',
    overlay: 'boolean',
    workspace: 'state',
    me: 'object',
  },

  subviews: {
    account: { hook: 'select-account', prepareView(el) {
      return new AccountField({
        el,
        accounts: this.accounts,
        parent: this,
        selectOpts: {
          tabIndex: 1,
        }
      });
    }},
    name: {
      hook: 'input-name',
      prepareView(el) {
        return new TextField({
          el,
          name: 'name',
          label: 'Name',
          placeholder: 'Type here...',
          value: '',
          tabIndex: 2,
          validations: [{
            run: value => value.length > 0,
            message: '*Name cannot be empty',
          }]
        });
      }
    },
    user: {
      hook: 'select-user',
      prepareView(el) {
        return new UserField({
          el,
          selectOpts: {
            tabIndex: 3,
          }
        });
      }
    },
    project: {
      hook: 'select-project',
      prepareView(el) {
        return new ProjectField({
          el,
          selectOpts: {
            tabIndex: 4,
          }
        });
      }
    },
    estimate: {
      hook: 'input-estimate',
      prepareView(el) {
        return new EstimateField({
          el,
          inputOpts: {
            tabIndex: 5,
          }
        });
      }
    },
    start_time: {
      hook: 'input-start-time',
      prepareView(el) {
        return new TimeField({
          el,
          inputOpts: {
            tabIndex: 6,
            name: 'start-time',
            label: 'Start Time'
          }
        });
      }
    },
    end_time: {
      hook: 'input-end-time',
      prepareView(el) {
        return new TimeField({
          el,
          inputOpts: {
            tabIndex: 7,
            name: 'end-time',
            label: 'End Time'
          }
        });
      }
    },
    start_date: {
      hook: 'input-start-date',
      prepareView(el) {
        return new DateField({
          el,
          inputOpts: {
            tabIndex: 8,
            name: 'start-date',
            label: 'Start Date'
          }
        });
      }
    },
    end_date: {
      hook: 'input-end-date',
      prepareView(el) {
        return new DateField({
          el,
          inputOpts: {
            tabIndex: 9,
            name: 'end-date',
            label: 'End Date'
          }
        });
      }
    },
    errors: { hook: 'errors', constructor: FormErrors },
  },

  collections: {
    accounts: AccountCollection
  },

  events: {
    'submit [data-hook=form]': 'onSubmit',
    'click [data-hook=button-cancel]': 'onCancel'
  },

  derived: {
    accountIsReadonly: {
      deps: ['workspace.id', 'me.id'],
      fn() {
        if (!(this.workspace && this.me)) {
          return false;
        }

        const {id} = this.me;
        const {role} = this.workspace.users.get(id);
        return role === 'readonly';
      }
    }
  },

  bindings: {
    'user.isFilled': {
      type: 'booleanClass',
      hook: 'select-user',
      yes: 'user-select--filled',
      no: 'user-select--empty'
    },
    'project.isFilled': {
      type: 'booleanClass',
      hook: 'select-project',
      yes: 'project-select--filled',
      no: 'project-select--empty'
    },
    'overlay': {
      type: 'booleanClass',
      hook: 'done-overlay',
      yes: 'task-popup__overlay--visible',
      no: 'task-popup__overlay--hidden'
    },
    accountIsReadonly: [
      {
        type: 'booleanClass',
        yes: 'task-popup--disabled'
      },
      {
        type: 'booleanAttribute',
        selector: '.button--submit',
        name: 'disabled',
      },
      {
        type: 'toggle',
        hook: 'readonly-label',
      }
    ],
  },

  render() {
    this.renderWithTemplate(this);

    [
      this.name,
      this.start_date,
      this.end_date,
      this.start_time,
      this.end_time,
      this.user,
      this.project,
      this.estimate,
      this.account
    ].forEach(field => {
      this.listenTo(field, 'change:value', this.hideErrors);
    }, this);

    this.listenTo(this.account, 'change:value', this.onAccountSelected);

    this.name.value = this.model.name;
    this.start_date.value = this.model.start_date;
    this.end_date.value = this.model.end_date;
    this.start_time.value = this.model.start_time;
    this.end_time.value = this.model.end_time;

    this.hub.trigger('loader:show');

    Promise.all([
      fetchPreferences(),
      fetchMe(),
      this.accounts.fetchEverything(),
    ]).then(([preferences, me]) => {
        this.me = me;

        this
          .account
          .switchAccount(this.accounts.get(preferences.selected_account_id));

        this.hub.trigger('loader:hide');
        this.focusNameField();
      }, error => {
        this.hub.trigger('loader:hide');
        this.hub.trigger('error:show', error);
      });

    return this;
  },

  onAccountSelected() {
    this.workspace = this.accounts.get(this.account.value);
    this.user.switchAccount(this.workspace);
    this.project.value = null;
    this.project.collection = this.workspace.projects;

    this.name.input.disabled = this.accountIsReadonly;
    this.user.disabled = this.accountIsReadonly;
    this.project.disabled = this.accountIsReadonly;
    this.start_date.disabled = this.accountIsReadonly;
    this.end_date.disabled = this.accountIsReadonly;
    this.start_time.disabled = this.accountIsReadonly;
    this.end_time.disabled = this.accountIsReadonly;
    this.estimate.disabled = this.accountIsReadonly;
  },

  onSubmit(event) {
    event.preventDefault();
    event.stopPropagation();

    if (!this.validate()) {
      return;
    }

    this.model.set({
      name: this.name.input.value,
      user_id: this.user.value,
      project_id: this.project.value,
      start_date: this.start_date.value,
      end_date: this.end_date.value,
      start_time: this.start_time.value,
      end_time: this.end_time.value,
      estimated_minutes: this.estimate.value,
    });

    //
    if (this.model.collection) {
      this.model.collection.remove(this.model);
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

    this.model.save()
      .then(() => {
        this.hub.trigger('task:created', this.model, this.workspace);

        this.hideLoader();
        this.showOverlay().then(() => this.closePopup());
      }, error => {
        this.hideLoader();
        this.showError(error);
      });
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
  }
});

module.exports = TaskView;
