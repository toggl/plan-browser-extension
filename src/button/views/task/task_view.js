var moment = require('moment');
var View = require('ampersand-view');
var AccountCollection = require('../../models/account_collection');
var TaskModel = require('../../models/task_model');

var TextField = require('./fields/text_field');
var UserField = require('./fields/user_field');
var DateField = require('./fields/date_field');
var TimeField = require('./fields/time_field');

var TaskView = View.extend({

  template: require('./task_view.hbs'),

  props: {
    hub: 'state'
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
      });

    return this;
  },

  onSubmit: function(event) {
    event.preventDefault();

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

    var hub = this.hub;
    hub.trigger('loader:show');

    this.model.save().then(function() {
      hub.trigger('loader:hide');
      hub.trigger('popup:close');
    });
  },

  onCancel: function(event) {
    event.preventDefault();
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

  clearErrors: function() {
    this.queryAll('[data-hook^=errors]').forEach(function(el) {
      el.innerText = null;
    });
  },

  addError: function(key, error) {
    var el = this.queryByHook('errors-' + key);
    el.innerText = error;
  }

});

module.exports = TaskView;
