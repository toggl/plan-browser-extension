var RestCollection = require('ampersand-rest-collection');
var AccountModel = require('./account_model');
var sync = require('../api/sync');

var AccountCollection = RestCollection.extend({

  model: AccountModel,

  url: 'https://teamweek.com/api/v3/me/accounts',

  sync: sync,

  fetchWithUsers: function() {
    return this.fetch().then(this.fetchAllUsers.bind(this));
  },

  fetchAllUsers: function() {
    var users = this.map(function(account) {
      return account.users.fetch();
    });

    return Promise.all(users);
  }

});

module.exports = AccountCollection;
