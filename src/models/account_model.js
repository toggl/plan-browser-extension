import Model from 'ampersand-model';
import UserCollection from './user_collection';
import ProjectCollection from './project_collection';
import TaskCollection from './task_collection';
import ColorCollection from './color_collection';
import sync from '../api/api_sync';

const AccountModel = Model.extend({
  props: {
    id: 'number',
    name: 'string',
  },

  collections: {
    users: UserCollection,
    projects: ProjectCollection,
    tasks: TaskCollection,
    colors: ColorCollection,
  },

  sync,
});

export default AccountModel;
