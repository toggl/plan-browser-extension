var Model = require('ampersand-model');
var sync = require('../api/api_sync');

var UserModel = Model.extend({

  props: {
    id: 'number',
    name: 'string',
    active: 'boolean',
    weight: 'number'
  },

  sync: sync

});

module.exports = UserModel;
