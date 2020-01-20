import sync from '../api/api_sync';
import Collection from 'ampersand-rest-collection';
import Segment from './segment_model';

const Segments = Collection.extend({
  model: Segment,

  sync,

  url() {
    return this.parent.url() + '/segments';
  },

  comparator: 'position',
});

export default Segments;
