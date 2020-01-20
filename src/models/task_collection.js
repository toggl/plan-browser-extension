import RestCollection from 'ampersand-rest-collection';
import TaskModel from './task_model';
import config from '../api/config';
import sync from '../api/api_sync';

const TaskCollection = RestCollection.extend({
  model: TaskModel,

  url() {
    return config.api.host + '/api/v5/' + this.parent.id + '/tasks';
  },

  sync,
});

export default TaskCollection;
