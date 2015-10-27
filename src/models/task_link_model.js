var Model = require('ampersand-model');
var sync = require('../api/local_sync');

var TaskLinkModel = Model.extend({

  props: {
    source_link: 'string',
    task_id: 'number',
    account_id: 'number'
  },

  sync: sync('task_links')

});

module.exports = TaskLinkModel;
