var Model = require('ampersand-model');
var sync = require('../api/local_sync');

var TaskSourceModel = Model.extend({

  props: {
    task_id: 'number',
    account_id: 'number',
    source_link: 'string'
  },

  sync: sync('task_sources')

});

module.exports = TaskSourceModel;
