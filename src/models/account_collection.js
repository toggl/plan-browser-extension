var Promise = require('bluebird');
var RestCollection = require('ampersand-rest-collection');
var AccountModel = require('./account_model');
var config = require('../api/config');
var sync = require('../api/api_sync');

var AccountCollection = RestCollection.extend({

  model: AccountModel,

  url: config.api.host + '/api/v3/me/accounts',

  sync: sync,

  fetchEverything: function() {
    var self = this;

    return this.fetch()
      .then(function() {
        return Promise.all([
          self.fetchAllUsers(),
          self.fetchAllProjects()
        ]);
      });
  },

  fetchAllUsers: function() {
    var users = this.map(function(account) {
      return account.users.fetch();
    });

    return Promise.all(users);
  },

  fetchAllProjects: function() {
    var projects = this.map(function(account) {
      return account.projects.fetch();
    });

    return Promise.all(projects);
  }

});

module.exports = AccountCollection;
