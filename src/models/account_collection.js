var RestCollection = require('ampersand-rest-collection');
var AccountModel = require('./account_model');
var sync = require('../api/sync');

var AccountCollection = RestCollection.extend({

  model: AccountModel,

  url: 'https://teamweek.com/api/v3/me/accounts',

  sync: sync

});

module.exports = AccountCollection;
