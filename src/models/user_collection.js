const RestCollection = require('ampersand-rest-collection');
const UserModel = require('./user_model');
const config = require('../api/config');
const sync = require('../api/api_sync');

const UserCollection = RestCollection.extend({
  model: UserModel,

  url() {
    return config.api.host + '/timeline/v1/' + this.parent.id + '/members';
  },

  sync
});

module.exports = UserCollection;
