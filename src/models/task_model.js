var moment = require('moment');
var Model = require('ampersand-model');
var sync = require('../api/api_sync');

var TaskModel = Model.extend({

  sync: sync,

  props: {
    id: 'number',
    name: 'string',
    user_id: 'number',
    project_id: 'number',
    start_date: { type: 'date', required: true },
    end_date: { type: 'date', required: true },
    start_time: 'string',
    end_time: 'string',
    estimated_hours: 'number'
  },

  serialize: function() {
    var res = Model.prototype.serialize.call(this);
    res.start_date = moment(res.start_date).format('YYYY-MM-DD');
    res.end_date = moment(res.end_date).format('YYYY-MM-DD');
    return res;
  }

});

module.exports = TaskModel;
