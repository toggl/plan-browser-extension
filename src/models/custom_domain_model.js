const Model = require('ampersand-model');
const sync = require('../api/local_sync');

const CustomDomainModel = Model.extend({
  props: {
    id: 'string',
    domain: 'string',
    service: 'string'
  },

  sync: sync('custom_domains')
});

module.exports = CustomDomainModel;
