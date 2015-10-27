var RestCollection = require('ampersand-rest-collection');
var TaskLinkModel = require('./task_link_model');
var sync = require('../api/local_sync');

var TaskLinkCollection = RestCollection.extend({

  model: TaskLinkModel,
  sync: sync('task_links')

});

module.exports = TaskLinkCollection;
