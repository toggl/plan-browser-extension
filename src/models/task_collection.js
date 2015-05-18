var RestCollection = require('ampersand-rest-collection');
var TaskModel = require('./task_model');
var sync = require('../api/sync');

var TaskCollection = RestCollection.extend({

  model: TaskModel,

  url: function() {
    return 'https://teamweek.com/api/v3/' + this.parent.id + '/tasks';
  },

  sync: sync

});

module.exports = TaskCollection;
