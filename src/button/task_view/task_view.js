var moment = require('moment');
var View = require('ampersand-view');
var api = require('../../api/api');
var AccountCollection = require('../../models/account_collection');

var TextField = require('./fields/text_field');
var UserField = require('./fields/user_field');
var DateField = require('./fields/date_field');
var TimeField = require('./fields/time_field');

var TaskView = View.extend({

  template: require('./task_view.hbs'),

  props: {
    name: 'state',
    user: 'state',
    start_date: 'state',
    end_date: 'state',
    start_time: 'state',
    end_time: 'state'
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
    'click [data-hook=button-submit]': 'onSubmit'
  },

  render: function() {
    this.renderWithTemplate(this);

    var self = this;

    this.accounts.fetchWithUsers()
      .then(function() {
        self.user.render();
      });

    return this;
  },

  onSubmit: function(event) {
    event.preventDefault();
  }

});

module.exports = TaskView;
