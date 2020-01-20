import Model from 'ampersand-model';
import UserCollection from './user_collection';
import ProjectCollection from './project_collection';
import TaskCollection from './task_collection';
import ColorCollection from './color_collection';
import sync from '../api/api_sync';
import { getIsPremium } from 'src/api/billing';

const AccountModel = Model.extend({
  props: {
    id: 'number',
    name: 'string',
    pricing_system: 'string',
  },

  session: {
    isPremium: 'boolean',
  },

  collections: {
    users: UserCollection,
    projects: ProjectCollection,
    tasks: TaskCollection,
    colors: ColorCollection,
  },

  sync,

  async loadBilling() {
    this.isPremium = await getIsPremium(this);
  },
});

export default AccountModel;
