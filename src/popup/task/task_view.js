const Promise = require('bluebird');
const moment = require('moment');
const View = require('ampersand-view');
const AccountCollection = require('../../models/account_collection');
const FormErrors = require('../form/form_errors');
const TextField = require('../fields/text_field');
const UserField = require('../fields/user_field');
const ProjectField = require('../fields/project_field');
const EstimateField = require('../fields/estimate_field');
const DateField = require('../fields/date_field');
const TimeField = require('../fields/time_field');

const TaskView = View.extend({
  template: require('./task_view.hbs'),

  props: {
    hub: 'object',
    user: 'state',
    project: 'state',
    overlay: 'boolean'
  },

  subviews: {
    name: { hook: 'input-name', constructor: TextField },
    start_date: { hook: 'input-start-date', constructor: DateField },
    end_date: { hook: 'input-end-date', constructor: DateField },
    start_time: { hook: 'input-start-time', constructor: TimeField },
    end_time: { hook: 'input-end-time', constructor: TimeField },
    user: { hook: 'select-user', prepareView(el) {
      return new UserField({el, collection: this.accounts, parent: this});
    } },
    project: { hook: 'select-project', constructor: ProjectField },
    estimate: { hook: 'input-estimate', constructor: EstimateField },
    errors: { hook: 'errors', constructor: FormErrors }
  },

  collections: {
    accounts: AccountCollection
  },

  events: {
    'submit [data-hook=form]': 'onSubmit',
    'click [data-hook=button-cancel]': 'onCancel'
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
    }
  },

  render() {
    this.renderWithTemplate(this);

    [
      this.name, this.start_date, this.end_date, this.start_time, this.end_time,
      this.user, this.project, this.estimate
    ].forEach(field => {
      this.listenTo(field, 'change:value', this.hideErrors);
    }, this);

    this.listenTo(this.user, 'change:value', this.onUserSelected);

    this.name.value = this.model.name;
    this.start_date.value = this.model.start_date;
    this.end_date.value = this.model.end_date;
    this.start_time.value = this.model.start_time;
    this.end_time.value = this.model.end_time;

    this.hub.trigger('loader:show');

    this.accounts.fetchEverything()
      .then(() => {
        this.user.render();
        this.hub.trigger('loader:hide');
        this.focusNameField();
      }, error => {
        this.hub.trigger('loader:hide');
        this.hub.trigger('error:show', error);
      });

    return this;
  },

  onUserSelected() {
    const account = this.user.value.account;
    const projects = this.accounts.get(account).projects;
    this.project.collection = projects;
  },

  onSubmit(event) {
    event.preventDefault();
    event.stopPropagation();

    if (!this.validate()) {
      return;
    }

    this.model.set({
      name: this.name.value,
      user_id: this.user.value.user,
      project_id: this.project.value,
      start_date: this.start_date.value,
      end_date: this.end_date.value,
      start_time: this.start_time.value,
      end_time: this.end_time.value,
      estimated_hours: this.estimate.value
    });

    const account = this.accounts.get(this.user.value.account);
    account.tasks.add(this.model);

    this.showLoader();

    this.model.save()
      .then(() => {
        this.hub.trigger('task:created', this.model, account);

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

    if (this.estimate.isFilled && !this.estimate.isValid) {
      this.errors.addError('Daily estimate is not valid');
      return false;
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
