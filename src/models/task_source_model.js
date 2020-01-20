import Model from 'ampersand-model';
import sync from '../api/local_sync';

const TaskSourceModel = Model.extend({
  props: {
    task_id: 'number',
    account_id: 'number',
    source_link: 'string',
  },

  sync: sync('task_sources'),
});

export default TaskSourceModel;
