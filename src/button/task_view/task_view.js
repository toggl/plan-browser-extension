var View = require('ampersand-view');
var api = require('../../api/api');
var UserListView = require('./user_list_view');
var AccountCollection = require('../../models/account_collection');

var TaskView = View.extend({

  template: require('./task_view.hbs'),

  collections: {
    accounts: AccountCollection
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
  }

});

module.exports = TaskView;
