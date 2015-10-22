var Model = require('ampersand-model');
var UserCollection = require('./user_collection');
var ProjectCollection = require('./project_collection');
var TaskCollection = require('./task_collection');
var sync = require('../api/api_sync');

var AccountModel = Model.extend({

  props: {
    id: 'number',
    name: 'string'
  },

  collections: {
    users: UserCollection,
    projects: ProjectCollection,
    tasks: TaskCollection
  },

  sync: sync

});

module.exports = AccountModel;
