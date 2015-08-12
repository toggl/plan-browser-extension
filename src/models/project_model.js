var Model = require('ampersand-model');
var sync = require('../api/sync');

var ProjectModel = Model.extend({

  props: {
    id: 'number',
    name: 'string'
  },

  sync: sync

});

module.exports = ProjectModel;
