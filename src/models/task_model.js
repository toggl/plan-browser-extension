import moment from 'moment';
import Model from 'ampersand-model';
import sync from '../api/api_sync';

const TaskModel = Model.extend({
  sync,

  props: {
    id: 'number',
    name: 'string',
    user_id: 'number',
    project_id: 'number',
    project_segment_id: 'number',
    start_date: 'string',
    end_date: 'string',
    start_time: 'string',
    end_time: 'string',
    estimated_minutes: 'number',
    notes: 'string',
    color: 'number',
    done: 'boolean',
    workspace_members: ['array', true, () => []],
  },

  serialize() {
    const res = Model.prototype.serialize.call(this);
    if (res.start_date) {
      res.start_date = moment(res.start_date).format('YYYY-MM-DD');
    }
    if (res.end_date) {
      res.end_date = moment(res.end_date).format('YYYY-MM-DD');
    }
    return res;
  },

  assigned(user) {
    return -1 !== this.workspace_members.indexOf(user.membership_id);
  },
});

export default TaskModel;
