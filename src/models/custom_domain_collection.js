import RestCollection from 'ampersand-rest-collection';
import CustomDomainModel from './custom_domain_model';
import sync from 'src/api/local_sync';

const CustomDomainCollection = RestCollection.extend({
  model: CustomDomainModel,
  sync: sync('custom_domains'),

  enableAutoSync() {
    chrome.storage.onChanged.addListener(changes => {
      if ('custom_domains' in changes) {
        this.fetch();
      }
    });
  },
});

export default CustomDomainCollection;
