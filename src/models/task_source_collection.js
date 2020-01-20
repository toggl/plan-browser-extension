import RestCollection from 'ampersand-rest-collection';
import TaskSourceModel from './task_source_model';
import sync from '../api/local_sync';

const TaskSourceCollection = RestCollection.extend({
  model: TaskSourceModel,

  sync: sync('task_sources'),
});

export default TaskSourceCollection;
