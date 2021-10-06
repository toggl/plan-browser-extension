import sync from '../api/api_sync';
import Collection from 'ampersand-rest-collection';
import Status from './status_model';

const Statuses = Collection.extend({
  model: Status,

  sync,

  url() {
    return this.parent.url() + '/statuses';
  },

  comparator: 'position',
});

export default Statuses;
