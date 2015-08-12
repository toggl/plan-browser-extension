var Model = require('ampersand-model');

var CustomDomainModel = Model.extend({

  props: {
    domain: 'string',
    service: 'string'
  }

});

module.exports = CustomDomainModel;
