const RestCollection = require('ampersand-rest-collection');
const TaskSourceModel = require('./task_source_model');
const sync = require('../api/local_sync');

const TaskSourceCollection = RestCollection.extend({
  model: TaskSourceModel,

  sync: sync('task_sources')
});

module.exports = TaskSourceCollection;
