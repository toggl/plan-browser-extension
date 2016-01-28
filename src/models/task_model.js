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
    start_date: ['date', false, function() { return new Date(); }],
    end_date: ['date', false, function() { return new Date(); }],
    start_time: 'string',
    end_time: 'string',
    estimated_hours: 'number'
  },

  parse: function(attrs) {
    return {
      name: attrs.name,
      start_date: attrs.start_date ? moment(attrs.start_date, 'YYYY-MM-DD').toDate() : undefined,
      end_Date: attrs.end_Date ? moment(attrs.end_Date, 'YYYY-MM-DD').toDate() : undefined
    };
  },

  serialize: function() {
    var res = Model.prototype.serialize.call(this);

    if (res.start_date != null) res.start_date = moment(res.start_date).format('YYYY-MM-DD');
    if (res.end_date != null) res.end_date = moment(res.end_date).format('YYYY-MM-DD');
    
    return res;
  }

});

module.exports = TaskModel;
