const RestCollection = require('ampersand-rest-collection');
const TaskModel = require('./task_model');
const config = require('../api/config');
const sync = require('../api/api_sync');

const TaskCollection = RestCollection.extend({
  model: TaskModel,

  url() {
    return config.api.host + '/timeline/v1/' + this.parent.id + '/tasks';
  },

  sync
});

module.exports = TaskCollection;
