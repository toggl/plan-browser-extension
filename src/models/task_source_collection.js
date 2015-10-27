var RestCollection = require('ampersand-rest-collection');
var TaskSourceModel = require('./task_source_model');
var sync = require('../api/local_sync');

var TaskSourceCollection = RestCollection.extend({

  model: TaskSourceModel,
  sync: sync('task_sources')

});

module.exports = TaskSourceCollection;
