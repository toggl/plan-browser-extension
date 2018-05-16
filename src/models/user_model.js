const Model = require('ampersand-model');
const sync = require('../api/api_sync');

const UserModel = Model.extend({
  props: {
    id: 'number',
    name: 'string',
    active: 'boolean',
    weight: 'number',
    picture_url: 'string',
    role: 'string',
  },

  sync,

  parse(attrs) {
    attrs.picture_url = attrs.picture_url || 'missing.png';
    return attrs;
  },
});

module.exports = UserModel;
