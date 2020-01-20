import Model from 'ampersand-model';
import sync from '../api/api_sync';

const UserModel = Model.extend({
  props: {
    id: 'number',
    name: 'string',
    active: 'boolean',
    weight: 'number',
    picture_url: 'string',
    role: 'string',
    initials: 'string',
    membership_id: 'number',
  },

  sync,

  parse(attrs) {
    attrs.picture_url = attrs.picture_url || 'missing.png';
    return attrs;
  },
});

export default UserModel;
