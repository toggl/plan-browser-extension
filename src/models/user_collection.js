var RestCollection = require('ampersand-rest-collection');
var UserModel = require('./user_model');
var config = require('../api/config');
var sync = require('../api/sync');

var UserCollection = RestCollection.extend({

  model: UserModel,

  url: function() {
    return config.api.host + '/api/v3/' + this.parent.id + '/users';
  },

  sync: sync

});

module.exports = UserCollection;
