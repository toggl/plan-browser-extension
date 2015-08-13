var RestCollection = require('ampersand-rest-collection');
var TaskModel = require('./task_model');
var config = require('../api/config');
var sync = require('../api/api_sync');

var TaskCollection = RestCollection.extend({

  model: TaskModel,

  url: function() {
    return config.api.host + '/api/v3/' + this.parent.id + '/tasks';
  },

  sync: sync

});

module.exports = TaskCollection;
