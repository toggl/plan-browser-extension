var RestCollection = require('ampersand-rest-collection');
var CustomDomainModel = require('./custom_domain_model');
var sync = require('../api/local_sync');

var CustomDomainCollection = RestCollection.extend({

  model: CustomDomainModel,
  sync: sync('custom_domains')

});

module.exports = CustomDomainCollection;
