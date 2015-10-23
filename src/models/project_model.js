var Model = require('ampersand-model');
var sync = require('../api/api_sync');

var ProjectModel = Model.extend({

  props: {
    id: 'number',
    name: 'string'
  },

  sync: sync

});

module.exports = ProjectModel;
