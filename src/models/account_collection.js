import RestCollection from 'ampersand-rest-collection';
import AccountModel from './account_model';
import sync from '../api/api_sync';

const AccountCollection = RestCollection.extend({
  model: AccountModel,

  sync,
});

export default new AccountCollection();
