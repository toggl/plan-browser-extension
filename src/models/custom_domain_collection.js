const RestCollection = require('ampersand-rest-collection');
const CustomDomainModel = require('./custom_domain_model');
const sync = require('../api/local_sync');

const CustomDomainCollection = RestCollection.extend({

  model: CustomDomainModel,
  sync: sync('custom_domains'),

  enableAutoSync() {
    chrome.storage.onChanged.addListener(changes => {
      if ('custom_domains' in changes) {
        this.fetch();
      }
    });
  }
});

module.exports = CustomDomainCollection;
