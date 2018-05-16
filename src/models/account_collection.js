const Promise = require('bluebird');
const RestCollection = require('ampersand-rest-collection');
const AccountModel = require('./account_model');
const sync = require('../api/api_sync');

const AccountCollection = RestCollection.extend({
  model: AccountModel,

  sync,

  fetchEverything() {
    return Promise.all([
      this.fetchAllUsers(),
      this.fetchAllProjects()
    ]);
  },

  fetchAllUsers() {
    const users = this.map(function(account) {
      return account.users.fetch();
    });

    return Promise.all(users);
  },

  fetchAllProjects() {
    const projects = this.map(function(account) {
      return account.projects.fetch();
    });

    return Promise.all(projects);
  }
});

module.exports = new AccountCollection();
