const moment = require('moment');
const Model = require('ampersand-model');
const sync = require('../api/api_sync');

const TaskModel = Model.extend({
  sync,

  props: {
    id: 'number',
    name: 'string',
    user_id: 'number',
    project_id: 'number',
    start_date: ['date', false, () => new Date()],
    end_date: ['date', false, () => new Date()],
    start_time: 'string',
    end_time: 'string',
    estimated_minutes: 'number',
    notes: 'string'
  },

  parse(attrs) {
    return Object.assign({}, attrs, {
      start_date: attrs.start_date
        ? moment(attrs.start_date, 'YYYY-MM-DD').toDate()
        : undefined,
      end_date: attrs.end_date
        ? moment(attrs.end_date, 'YYYY-MM-DD').toDate()
        : undefined
    });
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
  }
});

module.exports = TaskModel;
