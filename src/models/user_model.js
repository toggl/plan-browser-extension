var Model = require('ampersand-model');
var sync = require('../api/sync');

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
