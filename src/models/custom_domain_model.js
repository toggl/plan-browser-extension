var Model = require('ampersand-model');
var sync = require('../api/local_sync');

var CustomDomainModel = Model.extend({

  props: {
    id: 'string',
    domain: 'string',
    service: 'string'
  },

  sync: sync('custom_domains')

});

module.exports = CustomDomainModel;
