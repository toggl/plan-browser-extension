var RestCollection = require('ampersand-rest-collection');
var CustomDomainModel = require('./custom_domain_model');

var CustomDomainCollection = RestCollection.extend({

  model: CustomDomainModel

});

module.exports = CustomDomainCollection;
