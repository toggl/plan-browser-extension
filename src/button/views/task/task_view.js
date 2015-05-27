var Promise = require('promise');
var moment = require('moment');
var View = require('ampersand-view');
var AccountCollection = require('../../models/account_collection');
var TaskModel = require('../../models/task_model');

var FormMixin = require('../form/form_mixin');
var TextField = require('../fields/text_field');
var UserField = require('../fields/user_field');
var DateField = require('../fields/date_field');
var TimeField = require('../fields/time_field');

var TaskView = View.extend(FormMixin, {

  template: require('./task_view.hbs'),

  props: {
    hub: 'state',
    user: 'state',
    overlay: 'boolean'
  },

  subviews: {
    name: { hook: 'input-name', constructor: TextField },
    start_date: { hook: 'input-start-date', constructor: DateField },
    end_date: { hook: 'input-end-date', constructor: DateField },
    start_time: { hook: 'input-start-time', constructor: TimeField },
    end_time: { hook: 'input-end-time', constructor: TimeField },
    user: { hook: 'select-user', prepareView: function(el) {
      return new UserField({ el: el, collection: this.accounts, parent: this });
    } }
  },

  collections: {
    accounts: AccountCollection
  },

  events: {
    'click [data-hook=button-submit]': 'onSubmit',
    'click [data-hook=button-cancel]': 'onCancel'
  },

  bindings: {
    'user.isFilled': {
      type: 'booleanClass',
      hook: 'select-user',
      yes: 'user-select--filled',
      no: 'user-select--empty'
    },
    'overlay': {
      type: 'booleanClass',
      hook: 'done-overlay',
      yes: 'task-popup__overlay--visible',
      no: 'task-popup__overlay--hidden'
    }
  },

  render: function() {
    this.renderWithTemplate(this);

    this.name.value = this.model.name;
    this.start_date.value = this.model.start_date;
    this.end_date.value = this.model.end_date

    this.hub.trigger('loader:show');

    var self = this;

    this.accounts.fetchWithUsers()
      .then(function() {
        self.user.render();
        self.hub.trigger('loader:hide');
      }, function(error) {
        self.hub.trigger('loader:hide');
        self.hub.trigger('error:show', error);
      });

    return this;
  },

  onSubmit: function(event) {
    event.preventDefault();
    event.stopPropagation();

    if (!this.validate()) return;

    this.model.set({
      name: this.name.value,
      user_id: this.user.value.user,
      start_date: this.start_date.value,
      end_date: this.end_date.value,
      start_time: this.start_time.value,
      end_time: this.end_time.value
    });

    this.accounts
      .get(this.user.value.account)
      .tasks.add(this.model);

    this.showLoader();
    var self = this;

    this.model.save()
      .then(function() {
        self.hideLoader();
        self.showOverlay()
          .then(function() { self.closePopup() });
      }, function(error) {
        self.hideLoader();
        self.showError(error);
      });
  },

  onCancel: function(event) {
    event.preventDefault();
    event.stopPropagation();
    this.hub.trigger('popup:close');
  },

  validate: function() {
    var valid = true;

    this.clearErrors();

    if (!this.name.isFilled) {
      this.addError('name', 'Task name cannot be empty');
      valid = false;
    }

    if (!this.user.isFilled) {
      this.addError('user', 'User cannot be empty');
      valid = false;
    }

    if (!this.start_date.isFilled) {
      this.addError('start', 'Start date cannot be empty');
      valid = false;
    }

    if (!this.end_date.isFilled) {
      this.addError('end', 'End date cannot be empty');
      valid = false;
    }

    if (moment(this.end_date.value).isBefore(this.start_date.value, 'day')) {
      this.addError('end', 'End date cannot be before start date');
      valid = false;
    }

    return valid;
  },

  showLoader: function() {
    this.hub.trigger('loader:show');
  },

  hideLoader: function() {
    this.hub.trigger('loader:hide');
  },

  showOverlay: function() {
    var self = this;

    return new Promise(function(resolve, reject) {
      self.overlay = true;
      setTimeout(resolve, 2000);
    });
  },

  closePopup: function() {
    this.hub.trigger('popup:close');
  },

  showError: function(error) {
    this.hub.trigger('error:show', error);
  }

});

module.exports = TaskView;
