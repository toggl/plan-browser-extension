import RestCollection from 'ampersand-rest-collection';
import UserModel from './user_model';
import config from '../api/config';
import sync from '../api/api_sync';

const UserCollection = RestCollection.extend({
  model: UserModel,

  comparator: 'name',

  url() {
    return config.api.host + '/api/v4/' + this.parent.id + '/members';
  },

  sync,
});

export default UserCollection;
