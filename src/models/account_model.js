const Model = require('ampersand-model');
const UserCollection = require('./user_collection');
const ProjectCollection = require('./project_collection');
const TaskCollection = require('./task_collection');
const CustomColorCollection = require('./custom_color_collection');
const sync = require('../api/api_sync');

const AccountModel = Model.extend({
  props: {
    id: 'number',
    name: 'string'
  },

  collections: {
    users: UserCollection,
    projects: ProjectCollection,
    tasks: TaskCollection,
    customColors: CustomColorCollection,
  },

  sync
});

module.exports = AccountModel;
