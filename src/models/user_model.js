const Model = require('ampersand-model');
const sync = require('../api/api_sync');

const UserModel = Model.extend({
  props: {
    id: 'number',
    name: 'string',
    active: 'boolean',
    weight: 'number'
  },

  sync
});

module.exports = UserModel;
