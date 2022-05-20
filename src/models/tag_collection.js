import RestCollection from 'ampersand-rest-collection';
import TagModel from './tag_model';
import sync from '../api/api_sync';

const TagCollection = RestCollection.extend({
  model: TagModel,

  sync,

  comparator: 'name',

  url() {
    return this.parent.url() + '/tags';
  },
});

export default TagCollection;
