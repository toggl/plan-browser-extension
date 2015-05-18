var moment = require('moment');
var View = require('ampersand-view');
var api = require('../../api/api');
var UserListView = require('./user_list_view');
var AccountCollection = require('../../models/account_collection');

var TaskView = View.extend({

  template: require('./task_view.hbs'),

  collections: {
    accounts: AccountCollection
  },

  events: {
    'click [data-hook=button-submit]': 'onSubmit'
  },

  render: function() {
    this.renderWithTemplate(this);

    var users = new UserListView({
      name: 'user',
      id: 'tw-form-' + this.cid + '-user',
      collection: this.accounts
    });

    this.renderSubview(users, this.queryByHook('container-users'));

    this.accounts.fetchWithUsers()
      .then(function() {
        users.render();
      });

    return this;
  },

  onSubmit: function(event) {
    event.preventDefault();

    var values = this.getValues();
    console.log(values);
  },

  getValues: function() {
    var name = this.queryByHook('input-name').value;
    var selection = JSON.parse(this.queryByHook('select-user').value);
    var startDate = moment(this.queryByHook('input-start-date').value);
    var endDate = moment(this.queryByHook('input-end-date').value);
    var startTime = moment(this.queryByHook('input-start-time').value, 'HH:mm:ss');
    var endTime = moment(this.queryByHook('input-end-time').value, 'HH:mm:ss');

    return {
      name: name,
      account_id: selection.account,
      user_id: selection.user,
      start_date: startDate.isValid() ? startDate.toDate() : null,
      end_date: endDate.isValid() ? endDate.toDate() : null,
      start_time: startTime.isValid() ? startTime.format('HH:mm') : null,
      end_time: endTime.isValid() ? endTime.format('HH:mm') : null
    };
  }

});

module.exports = TaskView;
