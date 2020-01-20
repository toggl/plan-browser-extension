import Model from 'ampersand-model';
import sync from '../api/api_sync';

export default Model.extend({
  sync,

  extraProperties: 'allow',
  comparator: 'name',

  props: {
    position: 'number',
    name: 'string',
  },
});
