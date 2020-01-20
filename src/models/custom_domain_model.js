import Model from 'ampersand-model';
import sync from 'src/api/local_sync';

const CustomDomainModel = Model.extend({
  props: {
    id: 'string',
    domain: 'string',
    service: 'string',
  },

  sync: sync('custom_domains'),
});

export default CustomDomainModel;
