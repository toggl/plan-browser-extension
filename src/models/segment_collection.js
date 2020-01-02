import Model from 'ampersand-model';
import sync from '../api/api_sync';
import Collection from 'ampersand-rest-collection';

const Segment = Model.extend({
  sync,

  extraProperties: 'allow',
  comparator: 'name',

  props: {
    position: 'number',
    name: 'string',
  },
});

const Segments = Collection.extend({
  model: Segment,

  sync,

  comparator: 'position',
});

export default Segments;
