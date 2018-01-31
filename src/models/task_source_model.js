const Model = require('ampersand-model');
const sync = require('../api/local_sync');

const TaskSourceModel = Model.extend({
  props: {
    task_id: 'number',
    account_id: 'number',
    source_link: 'string'
  },

  sync: sync('task_sources')
});

module.exports = TaskSourceModel;
