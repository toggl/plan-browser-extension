const RestCollection = require('ampersand-rest-collection');
const UserModel = require('./user_model');
const config = require('../api/config');
const sync = require('../api/api_sync');

const UserCollection = RestCollection.extend({
  model: UserModel,

  url() {
    return config.api.host + '/api/v4/' + this.parent.id + '/members';
  },

  sync
});

module.exports = UserCollection;
